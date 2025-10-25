/**
 * Terrain System - Manages terrain tiles and 3D printing integration
 */

export interface TerrainTile {
  id: string;
  type: 'floor' | 'bridge' | 'cliff' | 'lava' | 'water' | 'turret' | 'trap' | 'ruins' | 'vent' | 'crate';
  position: { x: number; y: number };
  height: number;
  properties: {
    owner?: string;
    card?: string;
    legoCompatible?: boolean;
    stlFile?: string;
    connections?: ConnectionPoint[];
    [key: string]: any;
  };
}

export interface ConnectionPoint {
  id: string;
  position: { x: number; y: number; z: number };
  type: 'lego' | 'magnetic' | 'snap' | 'screw';
  compatible: string[];
}

export interface STLFile {
  filename: string;
  path: string;
  description: string;
  printTime: number; // in minutes
  material: 'PLA' | 'PETG' | 'ABS' | 'TPU';
  supports: boolean;
  legoCompatible: boolean;
}

export class TerrainManager {
  private terrain: TerrainTile[] = [];
  private stlFiles: Map<string, STLFile> = new Map();

  constructor() {
    this.loadSTLFiles();
  }

  /**
   * Add a new terrain tile
   */
  addTerrainTile(tile: TerrainTile): void {
    // Check for conflicts
    const existing = this.terrain.find(t => 
      t.position.x === tile.position.x && t.position.y === tile.position.y
    );
    
    if (existing) {
      throw new Error(`Position (${tile.position.x}, ${tile.position.y}) is already occupied`);
    }

    this.terrain.push(tile);
  }

  /**
   * Remove a terrain tile
   */
  removeTerrainTile(id: string): boolean {
    const index = this.terrain.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    this.terrain.splice(index, 1);
    return true;
  }

  /**
   * Get terrain at specific position
   */
  getTerrainAt(x: number, y: number): TerrainTile | undefined {
    return this.terrain.find(t => t.position.x === x && t.position.y === y);
  }

  /**
   * Get all terrain tiles
   */
  getAllTerrain(): TerrainTile[] {
    return [...this.terrain];
  }

  /**
   * Get terrain tiles by type
   */
  getTerrainByType(type: TerrainTile['type']): TerrainTile[] {
    return this.terrain.filter(t => t.type === type);
  }

  /**
   * Get terrain tiles owned by a player
   */
  getTerrainByOwner(playerId: string): TerrainTile[] {
    return this.terrain.filter(t => t.properties.owner === playerId);
  }

  /**
   * Check if position is valid for placement
   */
  canPlaceAt(x: number, y: number, tileType: TerrainTile['type']): boolean {
    // Check if position is occupied
    const existing = this.getTerrainAt(x, y);
    if (existing) return false;

    // Check terrain-specific rules
    switch (tileType) {
      case 'bridge':
        // Bridges need to connect two land masses
        return this.canPlaceBridge(x, y);
      case 'turret':
        // Turrets need solid ground
        return this.canPlaceTurret(x, y);
      case 'trap':
        // Traps can be placed on any floor
        return this.hasFloorAt(x, y);
      default:
        return true;
    }
  }

  /**
   * Create a terrain tile from a structure card
   */
  createFromCard(cardId: string, position: { x: number; y: number }, owner: string): TerrainTile {
    const tileType = this.getTileTypeFromCard(cardId);
    
    if (!this.canPlaceAt(position.x, position.y, tileType)) {
      throw new Error(`Cannot place ${tileType} at position (${position.x}, ${position.y})`);
    }

    const tile: TerrainTile = {
      id: `${cardId}_${Date.now()}`,
      type: tileType,
      position,
      height: this.getDefaultHeight(tileType),
      properties: {
        owner,
        card: cardId,
        legoCompatible: this.isLegoCompatible(tileType),
        stlFile: this.getSTLFileForType(tileType),
        connections: this.getConnectionPoints(tileType)
      }
    };

    this.addTerrainTile(tile);
    return tile;
  }

  /**
   * Get STL file for a terrain type
   */
  getSTLFileForType(tileType: TerrainTile['type']): string | undefined {
    const stlFile = this.stlFiles.get(tileType);
    return stlFile?.filename;
  }

  /**
   * Get all STL files needed for current terrain
   */
  getRequiredSTLFiles(): STLFile[] {
    const requiredTypes = new Set(this.terrain.map(t => t.type));
    return Array.from(requiredTypes)
      .map(type => this.stlFiles.get(type))
      .filter((file): file is STLFile => file !== undefined);
  }

  /**
   * Generate print queue for 3D printing
   */
  generatePrintQueue(): PrintQueue {
    const files = this.getRequiredSTLFiles();
    const queue: PrintQueue = {
      files: files.map(file => ({
        ...file,
        quantity: this.getQuantityNeeded(file.filename),
        priority: this.getPrintPriority(file.filename)
      })),
      totalPrintTime: files.reduce((sum, file) => sum + file.printTime, 0),
      estimatedCost: this.estimatePrintCost(files)
    };

    return queue;
  }

  /**
   * Export terrain layout for 3D printing
   */
  exportTerrainLayout(): TerrainLayout {
    return {
      tiles: this.terrain.map(tile => ({
        id: tile.id,
        type: tile.type,
        position: tile.position,
        stlFile: tile.properties.stlFile,
        connections: tile.properties.connections
      })),
      bounds: this.calculateBounds(),
      totalTiles: this.terrain.length
    };
  }

  /**
   * Load STL file definitions
   */
  private loadSTLFiles(): void {
    const stlFiles: STLFile[] = [
      {
        filename: 'base_hex_tile.stl',
        path: 'terrain/STL/base_hex_tile.stl',
        description: 'Basic hexagonal floor tile with Lego-compatible pegs',
        printTime: 45,
        material: 'PLA',
        supports: false,
        legoCompatible: true
      },
      {
        filename: 'turret_platform.stl',
        path: 'terrain/STL/turret_platform.stl',
        description: 'Raised platform for turret placement',
        printTime: 60,
        material: 'PLA',
        supports: true,
        legoCompatible: true
      },
      {
        filename: 'bridge_tile.stl',
        path: 'terrain/STL/bridge_tile.stl',
        description: 'Bridge connecting two terrain pieces',
        printTime: 30,
        material: 'PLA',
        supports: true,
        legoCompatible: true
      },
      {
        filename: 'trap_tile.stl',
        path: 'terrain/STL/trap_tile.stl',
        description: 'Floor tile with trap mechanism',
        printTime: 20,
        material: 'PLA',
        supports: false,
        legoCompatible: true
      },
      {
        filename: 'archway.stl',
        path: 'terrain/STL/archway.stl',
        description: 'Dungeon gate archway',
        printTime: 90,
        material: 'PLA',
        supports: true,
        legoCompatible: false
      }
    ];

    stlFiles.forEach(file => {
      this.stlFiles.set(this.getTypeFromFilename(file.filename), file);
    });
  }

  /**
   * Get tile type from card ID
   */
  private getTileTypeFromCard(cardId: string): TerrainTile['type'] {
    const cardTypeMap: Record<string, TerrainTile['type']> = {
      'watchtower': 'turret',
      'bridge': 'bridge',
      'trap': 'trap',
      'ruins': 'ruins',
      'vent': 'vent',
      'crate': 'crate'
    };

    return cardTypeMap[cardId] || 'floor';
  }

  /**
   * Get default height for terrain type
   */
  private getDefaultHeight(tileType: TerrainTile['type']): number {
    const heightMap: Record<TerrainTile['type'], number> = {
      'floor': 0,
      'bridge': 1,
      'cliff': 2,
      'lava': 0,
      'water': -1,
      'turret': 2,
      'trap': 0,
      'ruins': 1,
      'vent': 0,
      'crate': 1
    };

    return heightMap[tileType] || 0;
  }

  /**
   * Check if terrain type is Lego compatible
   */
  private isLegoCompatible(tileType: TerrainTile['type']): boolean {
    const compatibleTypes: TerrainTile['type'][] = [
      'floor', 'bridge', 'turret', 'trap', 'ruins', 'crate'
    ];
    return compatibleTypes.includes(tileType);
  }

  /**
   * Get connection points for terrain type
   */
  private getConnectionPoints(tileType: TerrainTile['type']): ConnectionPoint[] {
    const points: ConnectionPoint[] = [];
    
    // Add standard Lego connection points
    if (this.isLegoCompatible(tileType)) {
      points.push({
        id: 'lego_center',
        position: { x: 0, y: 0, z: 0 },
        type: 'lego',
        compatible: ['lego_peg', 'lego_plate']
      });
    }

    return points;
  }

  /**
   * Check if bridge can be placed
   */
  private canPlaceBridge(x: number, y: number): boolean {
    // Bridges need to connect two land masses
    // This is a simplified check - in reality, you'd check for adjacent terrain
    return true;
  }

  /**
   * Check if turret can be placed
   */
  private canPlaceTurret(x: number, y: number): boolean {
    // Turrets need solid ground (not water or lava)
    const adjacent = this.getTerrainAt(x, y);
    return !adjacent || (adjacent.type !== 'water' && adjacent.type !== 'lava');
  }

  /**
   * Check if there's floor at position
   */
  private hasFloorAt(x: number, y: number): boolean {
    const terrain = this.getTerrainAt(x, y);
    return terrain?.type === 'floor' || !terrain;
  }

  /**
   * Get quantity needed for STL file
   */
  private getQuantityNeeded(filename: string): number {
    const type = this.getTypeFromFilename(filename);
    return this.terrain.filter(t => t.type === type).length;
  }

  /**
   * Get print priority for STL file
   */
  private getPrintPriority(filename: string): 'high' | 'medium' | 'low' {
    const type = this.getTypeFromFilename(filename);
    const count = this.terrain.filter(t => t.type === type).length;
    
    if (count > 5) return 'high';
    if (count > 2) return 'medium';
    return 'low';
  }

  /**
   * Estimate print cost
   */
  private estimatePrintCost(files: STLFile[]): number {
    // Rough estimate: $0.10 per minute of print time
    const totalTime = files.reduce((sum, file) => sum + file.printTime, 0);
    return totalTime * 0.10;
  }

  /**
   * Calculate terrain bounds
   */
  private calculateBounds(): { minX: number; maxX: number; minY: number; maxY: number } {
    if (this.terrain.length === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const xs = this.terrain.map(t => t.position.x);
    const ys = this.terrain.map(t => t.position.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }

  /**
   * Get type from filename
   */
  private getTypeFromFilename(filename: string): TerrainTile['type'] {
    const nameMap: Record<string, TerrainTile['type']> = {
      'base_hex_tile.stl': 'floor',
      'turret_platform.stl': 'turret',
      'bridge_tile.stl': 'bridge',
      'trap_tile.stl': 'trap',
      'archway.stl': 'ruins'
    };

    return nameMap[filename] || 'floor';
  }
}

export interface PrintQueue {
  files: Array<STLFile & { quantity: number; priority: 'high' | 'medium' | 'low' }>;
  totalPrintTime: number;
  estimatedCost: number;
}

export interface TerrainLayout {
  tiles: Array<{
    id: string;
    type: TerrainTile['type'];
    position: { x: number; y: number };
    stlFile?: string;
    connections?: ConnectionPoint[];
  }>;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  totalTiles: number;
}



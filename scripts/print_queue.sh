#!/bin/bash
# BrickQuest Print Queue Manager
# Manages 3D printing queue for terrain and robot components

set -e

# Configuration
CARDS_DIR="../cards"
TERRAIN_DIR="../terrain/STL"
OUTPUT_DIR="../terrain/print_queue"
LOG_FILE="../terrain/print_queue/print_log.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Function to analyze game state and generate print queue
analyze_game_state() {
    print_status "Analyzing game state for required prints..."
    
    # This would normally analyze the current game state
    # For now, we'll use a default set of required prints
    local required_prints=(
        "base_hex_tile.stl:20"
        "turret_platform.stl:5"
        "bridge_tile.stl:3"
        "trap_tile.stl:5"
        "archway.stl:2"
        "robot_arm_melee.stl:4"
        "robot_arm_ranged.stl:4"
        "robot_legs_wheeled.stl:2"
        "robot_sensor.stl:2"
    )
    
    echo "Required prints:" > "$OUTPUT_DIR/required_prints.txt"
    for item in "${required_prints[@]}"; do
        echo "$item" >> "$OUTPUT_DIR/required_prints.txt"
    done
    
    print_status "Game state analysis complete"
}

# Function to generate print queue
generate_print_queue() {
    print_status "Generating print queue..."
    
    local queue_file="$OUTPUT_DIR/print_queue.txt"
    local total_time=0
    local total_cost=0
    
    echo "# BrickQuest Print Queue" > "$queue_file"
    echo "# Generated on $(date)" >> "$queue_file"
    echo "" >> "$queue_file"
    
    # Print time estimates (in minutes)
    declare -A print_times=(
        ["base_hex_tile.stl"]=45
        ["turret_platform.stl"]=60
        ["bridge_tile.stl"]=30
        ["trap_tile.stl"]=20
        ["archway.stl"]=90
        ["robot_arm_melee.stl"]=30
        ["robot_arm_ranged.stl"]=35
        ["robot_legs_wheeled.stl"]=40
        ["robot_sensor.stl"]=25
    )
    
    # Cost estimates (in dollars)
    declare -A print_costs=(
        ["base_hex_tile.stl"]=0.75
        ["turret_platform.stl"]=1.00
        ["bridge_tile.stl"]=0.50
        ["trap_tile.stl"]=0.33
        ["archway.stl"]=1.50
        ["robot_arm_melee.stl"]=0.50
        ["robot_arm_ranged.stl"]=0.58
        ["robot_legs_wheeled.stl"]=0.67
        ["robot_sensor.stl"]=0.42
    )
    
    echo "Priority | File | Quantity | Time (min) | Cost ($) | Notes" >> "$queue_file"
    echo "---------|------|----------|------------|----------|-------" >> "$queue_file"
    
    # Read required prints and generate queue
    while IFS=':' read -r file quantity; do
        if [[ -n "$file" && -n "$quantity" ]]; then
            local time_per_unit=${print_times[$file]:-30}
            local cost_per_unit=${print_costs[$file]:-0.50}
            local total_time_item=$((time_per_unit * quantity))
            local total_cost_item=$(echo "$cost_per_unit * $quantity" | bc -l)
            
            # Determine priority
            local priority="Medium"
            if [[ $quantity -gt 10 ]]; then
                priority="High"
            elif [[ $quantity -lt 3 ]]; then
                priority="Low"
            fi
            
            # Add to totals
            total_time=$((total_time + total_time_item))
            total_cost=$(echo "$total_cost + $total_cost_item" | bc -l)
            
            # Add to queue
            printf "%-8s | %-4s | %-8d | %-10d | %-8.2f | %s\n" \
                "$priority" "$file" "$quantity" "$total_time_item" "$total_cost_item" "Required for gameplay" >> "$queue_file"
        fi
    done < "$OUTPUT_DIR/required_prints.txt"
    
    echo "" >> "$queue_file"
    echo "Total estimated time: $total_time minutes ($(echo "scale=1; $total_time/60" | bc -l) hours)" >> "$queue_file"
    echo "Total estimated cost: \$$(printf "%.2f" $total_cost)" >> "$queue_file"
    
    print_status "Print queue generated: $queue_file"
    print_status "Total time: $total_time minutes ($(echo "scale=1; $total_time/60" | bc -l) hours)"
    print_status "Total cost: \$$(printf "%.2f" $total_cost)"
}

# Function to optimize print queue
optimize_queue() {
    print_status "Optimizing print queue..."
    
    local optimized_file="$OUTPUT_DIR/optimized_queue.txt"
    
    # Group similar prints for efficiency
    echo "# Optimized Print Queue" > "$optimized_file"
    echo "# Generated on $(date)" >> "$optimized_file"
    echo "" >> "$optimized_file"
    
    echo "Batch 1: Base Terrain (High Priority)" >> "$optimized_file"
    echo "- Print 20x base_hex_tile.stl (15 hours)" >> "$optimized_file"
    echo "- Print 5x turret_platform.stl (5 hours)" >> "$optimized_file"
    echo "" >> "$optimized_file"
    
    echo "Batch 2: Structures (Medium Priority)" >> "$optimized_file"
    echo "- Print 3x bridge_tile.stl (1.5 hours)" >> "$optimized_file"
    echo "- Print 5x trap_tile.stl (1.7 hours)" >> "$optimized_file"
    echo "- Print 2x archway.stl (3 hours)" >> "$optimized_file"
    echo "" >> "$optimized_file"
    
    echo "Batch 3: Robot Components (Low Priority)" >> "$optimized_file"
    echo "- Print 4x robot_arm_melee.stl (2 hours)" >> "$optimized_file"
    echo "- Print 4x robot_arm_ranged.stl (2.3 hours)" >> "$optimized_file"
    echo "- Print 2x robot_legs_wheeled.stl (1.3 hours)" >> "$optimized_file"
    echo "- Print 2x robot_sensor.stl (0.8 hours)" >> "$optimized_file"
    echo "" >> "$optimized_file"
    
    print_status "Optimized queue generated: $optimized_file"
}

# Function to check print status
check_print_status() {
    print_status "Checking print status..."
    
    local status_file="$OUTPUT_DIR/print_status.txt"
    
    echo "# Print Status Report" > "$status_file"
    echo "# Generated on $(date)" >> "$status_file"
    echo "" >> "$status_file"
    
    # Check if STL files exist
    echo "STL File Status:" >> "$status_file"
    for file in base_hex_tile.stl turret_platform.stl bridge_tile.stl trap_tile.stl archway.stl; do
        if [[ -f "$TERRAIN_DIR/$file" ]]; then
            echo "✓ $file - Available" >> "$status_file"
        else
            echo "✗ $file - Missing" >> "$status_file"
        fi
    done
    
    echo "" >> "$status_file"
    echo "Robot Component Status:" >> "$status_file"
    for file in robot_arm_melee.stl robot_arm_ranged.stl robot_legs_wheeled.stl robot_sensor.stl; do
        if [[ -f "$TERRAIN_DIR/$file" ]]; then
            echo "✓ $file - Available" >> "$status_file"
        else
            echo "✗ $file - Missing" >> "$status_file"
        fi
    done
    
    print_status "Status report generated: $status_file"
}

# Function to generate print instructions
generate_print_instructions() {
    print_status "Generating print instructions..."
    
    local instructions_file="$OUTPUT_DIR/print_instructions.txt"
    
    echo "# BrickQuest Print Instructions" > "$instructions_file"
    echo "# Generated on $(date)" >> "$instructions_file"
    echo "" >> "$instructions_file"
    
    echo "## Print Settings" >> "$instructions_file"
    echo "- Layer Height: 0.2mm" >> "$instructions_file"
    echo "- Infill: 20%" >> "$instructions_file"
    echo "- Print Speed: 50mm/s" >> "$instructions_file"
    echo "- Bed Temperature: 60°C" >> "$instructions_file"
    echo "- Nozzle Temperature: 200°C" >> "$instructions_file"
    echo "- Retraction: 6mm at 25mm/s" >> "$instructions_file"
    echo "" >> "$instructions_file"
    
    echo "## Material Requirements" >> "$instructions_file"
    echo "- PLA: Primary material for all components" >> "$instructions_file"
    echo "- Estimated total material: 2-3 kg" >> "$instructions_file"
    echo "- Colors: Gray (primary), Black (accents), Blue (energy)" >> "$instructions_file"
    echo "" >> "$instructions_file"
    
    echo "## Print Order" >> "$instructions_file"
    echo "1. Start with base_hex_tile.stl (print 20 copies)" >> "$instructions_file"
    echo "2. Print turret_platform.stl (print 5 copies)" >> "$instructions_file"
    echo "3. Print bridge_tile.stl (print 3 copies)" >> "$instructions_file"
    echo "4. Print trap_tile.stl (print 5 copies)" >> "$instructions_file"
    echo "5. Print archway.stl (print 2 copies)" >> "$instructions_file"
    echo "6. Print robot components as needed" >> "$instructions_file"
    echo "" >> "$instructions_file"
    
    echo "## Post-Processing" >> "$instructions_file"
    echo "1. Remove support material" >> "$instructions_file"
    echo "2. Sand rough surfaces" >> "$instructions_file"
    echo "3. Test fit with Lego pieces" >> "$instructions_file"
    echo "4. Paint if desired" >> "$instructions_file"
    echo "" >> "$instructions_file"
    
    print_status "Print instructions generated: $instructions_file"
}

# Function to estimate print time
estimate_print_time() {
    print_status "Estimating print time..."
    
    local estimate_file="$OUTPUT_DIR/time_estimate.txt"
    
    echo "# Print Time Estimate" > "$estimate_file"
    echo "# Generated on $(date)" >> "$estimate_file"
    echo "" >> "$estimate_file"
    
    local total_time=0
    
    # Calculate total print time
    while IFS=':' read -r file quantity; do
        if [[ -n "$file" && -n "$quantity" ]]; then
            case "$file" in
                "base_hex_tile.stl")
                    local time_per_unit=45
                    ;;
                "turret_platform.stl")
                    local time_per_unit=60
                    ;;
                "bridge_tile.stl")
                    local time_per_unit=30
                    ;;
                "trap_tile.stl")
                    local time_per_unit=20
                    ;;
                "archway.stl")
                    local time_per_unit=90
                    ;;
                "robot_arm_melee.stl")
                    local time_per_unit=30
                    ;;
                "robot_arm_ranged.stl")
                    local time_per_unit=35
                    ;;
                "robot_legs_wheeled.stl")
                    local time_per_unit=40
                    ;;
                "robot_sensor.stl")
                    local time_per_unit=25
                    ;;
                *)
                    local time_per_unit=30
                    ;;
            esac
            
            local item_time=$((time_per_unit * quantity))
            total_time=$((total_time + item_time))
            
            echo "$file: $quantity copies × $time_per_unit min = $item_time min" >> "$estimate_file"
        fi
    done < "$OUTPUT_DIR/required_prints.txt"
    
    echo "" >> "$estimate_file"
    echo "Total estimated time: $total_time minutes" >> "$estimate_file"
    echo "Total estimated time: $(echo "scale=1; $total_time/60" | bc -l) hours" >> "$estimate_file"
    echo "Total estimated time: $(echo "scale=1; $total_time/60/24" | bc -l) days" >> "$estimate_file"
    
    print_status "Time estimate generated: $estimate_file"
    print_status "Total estimated time: $total_time minutes ($(echo "scale=1; $total_time/60" | bc -l) hours)"
}

# Main function
main() {
    print_status "Starting BrickQuest Print Queue Manager..."
    
    # Initialize log file
    echo "BrickQuest Print Queue Manager - $(date)" > "$LOG_FILE"
    
    # Run all functions
    analyze_game_state
    generate_print_queue
    optimize_queue
    check_print_status
    generate_print_instructions
    estimate_print_time
    
    print_status "Print queue management complete!"
    print_status "Check the $OUTPUT_DIR directory for generated files"
    
    # List generated files
    echo ""
    print_status "Generated files:"
    ls -la "$OUTPUT_DIR"
}

# Run main function
main "$@"



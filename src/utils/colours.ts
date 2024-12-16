  export const sliderColors: String[] = [
    "#FF6F61", // Bold Coral
    "#FFA07A", // Light Salmon
    "#FFD700", // Bright Gold
    "#32CD32", // Lime Green
    "#1E90FF", // Dodger Blue
    "#9370DB", // Medium Purple
    "#FF8C00", // Dark Orange
    "#FF1493", // Deep Pink
    "#00CED1", // Dark Turquoise
    "#BA55D3", // Medium Orchid
    "#DC143C", // Crimson
    "#FF6347", // Tomato Red
    "#ADFF2F", // Green Yellow
    "#20B2AA", // Light Sea Green
    "#FF4500", // Orange Red
    "#FF69B4", // Hot Pink
    "#00FA9A", // Medium Spring Green
    "#7B68EE", // Medium Slate Blue
    "#4682B4", // Steel Blue
    "#FFDAB9"  // Peach Puff
    ];
  
    export function hexToRgb(hex) {
      // Remove '#' if present
      hex = hex.replace(/^#/, '');
      // Expand shorthand form (e.g., "03F") to full form (e.g., "0033FF")
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `${r}, ${g}, ${b}`;
    }
    
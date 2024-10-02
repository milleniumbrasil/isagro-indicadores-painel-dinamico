// src/components/colors.ts

export const greenBackgroundColor  = 'rgba(240, 255, 240, 0.6)'; // Verde muito claro com baixa opacidade
export const blueBackgroundColor   = 'rgba(173, 216, 230, 0.6)';  // Azul claro (próximo a "lightblue")
export const yellowBackgroundColor = 'rgba(255, 255, 224, 0.6)'; // Amarelo claro (próximo a "lightyellow")
export const purpleBackgroundColor = 'rgba(230, 230, 250, 0.6)'; // Roxo claro (próximo a "lavender")
export const grayBackgroundColor   = 'rgba(245, 245, 245, 0.6)';   // Cinza claro (próximo a "whitesmoke")
export const redBackgroundColor    = 'rgba(255, 182, 193, 0.1)';   // Vermelho claro (próximo a "lightpink")
export const brownBackgroundColor  = 'rgba(222, 184, 135, 0.1)'; // Marrom claro (próximo a "burlywood")
export const whiteBackgroundColor  = 'rgba(255, 255, 255, 0.6)';  // Branco com baixa opacidade

// Verde - Light, Medium, Dark
export const greenColors = {
    light: [
        { label: "Orvalho de Mel", value: "honeydew", color: '#F0FFF0' },
        { label: "Verde Claro", value: "lightGreen", color: '#A4DE6C' },
        { label: "Verde Pálido", value: "paleGreen", color: '#98FB98' },
        { label: "Verde Água Marinha Médio", value: "mediumAquamarine", color: '#66CDAA' },
        { label: "Verde Limão", value: "limeGreen", color: '#32CD32' }
    ],
    medium: [
        { label: "Verde Mar", value: "seaGreen", color: '#2E8B57' },
        { label: "Verde Floresta", value: "forestGreen", color: '#228B22' },
        { label: "Verde Primavera", value: "springGreen", color: '#00FF7F' },
        { label: "Verde Médio", value: "mediumSeaGreen", color: '#3CB371' },
        { label: "Verde Grama", value: "lawnGreen", color: '#7CFC00' }
    ],
    dark: [
        { label: "Verde", value: "green", color: '#008000' },
        { label: "Verde Escuro", value: "darkGreen", color: '#006400' },
        { label: "Verde Oliva Escuro", value: "darkOliveGreen", color: '#556B2F' },
        { label: "Verde Militar", value: "oliveDrab", color: '#6B8E23' },
        { label: "Verde Pinho", value: "pineGreen", color: '#01796F' }
    ]
};

// Vermelho - Light, Medium, Dark
export const redColors = {
    light: [
        { label: "Rosa Nebulosa", value: "mistyRose", color: '#FFE4E1' },
        { label: "Coral Claro", value: "lightCoral", color: '#FFC1C1' },
        { label: "Salmão", value: "salmon", color: '#FF8C8C' },
        { label: "Rosa Chá", value: "pink", color: '#FFC0CB' },
        { label: "Coral", value: "coral", color: '#FF7F50' }
    ],
    medium: [
        { label: "Tomate", value: "tomato", color: '#FF6347' },
        { label: "Tijolo Incandescente", value: "fireBrick", color: '#FF4D4D' },
        { label: "Carmesim", value: "crimson", color: '#DC143C' },
        { label: "Salmão Escuro", value: "darkSalmon", color: '#E9967A' },
        { label: "Rosa Indiano", value: "indianRed", color: '#CD5C5C' }
    ],
    dark: [
        { label: "Vermelho", value: "red", color: '#FF0000' },
        { label: "Vermelho Escuro", value: "darkRed", color: '#8B0000' },
        { label: "Marrom", value: "brown", color: '#A52A2A' },
        { label: "Bordô", value: "maroon", color: '#800000' },
        { label: "Vermelho Sangue", value: "bloodRed", color: '#660000' }
    ]
};

// Amarelo - Light, Medium, Dark
export const yellowColors = {
    light: [
        { label: "Amarelo Claro", value: "lightYellow", color: '#FFFFE0' },
        { label: "Chiffon Limão", value: "lemonChiffon", color: '#FFFACD' },
        { label: "Seda de Milho", value: "cornsilk", color: '#FFF8DC' },
        { label: "Mocassim", value: "moccasin", color: '#FFE4B5' },
        { label: "Chicote de Mamão", value: "papayaWhip", color: '#FFEFD5' }
    ],
    medium: [
        { label: "Ouro", value: "gold", color: '#FFD700' },
        { label: "Caqui", value: "khaki", color: '#F0E68C' },
        { label: "Mostarda", value: "mustard", color: '#FFDB58' },
        { label: "Milho Maduro", value: "maize", color: '#FBEC5D' },
        { label: "Amarelo Ouro", value: "goldenYellow", color: '#FFDF00' }
    ],
    dark: [
        { label: "Caqui Escuro", value: "darkKhaki", color: '#BDB76B' },
        { label: "Vara de Ouro Escura", value: "darkGoldenrod", color: '#B8860B' },
        { label: "Vara de Ouro", value: "goldenrod", color: '#DAA520' },
        { label: "Amarelo Torrado", value: "burntYellow", color: '#FFCC33' },
        { label: "Âmbar", value: "amber", color: '#FFBF00' }
    ]
};

// Azul - Light, Medium, Dark
export const blueColors = {
    light: [
        { label: "Azul Alice", value: "aliceBlue", color: '#F0F8FF' },
        { label: "Azul Claro", value: "lightBlue", color: '#ADD8E6' },
        { label: "Azul Pó", value: "powderBlue", color: '#B0E0E6' },
        { label: "Azul Céu", value: "skyBlue", color: '#87CEEB' },
        { label: "Azul Céu Claro", value: "lightSkyBlue", color: '#87CEFA' }
    ],
    medium: [
        { label: "Azul Aço", value: "steelBlue", color: '#4682B4' },
        { label: "Azul Dodger", value: "dodgerBlue", color: '#1E90FF' },
        { label: "Azul Milenar", value: "millenniumBlue", color: '#003366' },
        { label: "Azul Azulão", value: "vividBlue", color: '#00BFFF' },
        { label: "Azul Caribenho", value: "caribbeanBlue", color: '#1CA9C9' }
    ],
    dark: [
        { label: "Azul Real", value: "royalBlue", color: '#4169E1' },
        { label: "Azul", value: "blue", color: '#0000FF' },
        { label: "Azul Escuro", value: "darkBlue", color: '#00008B' },
        { label: "Azul Marinho", value: "navy", color: '#000080' },
        { label: "Azul Meia-Noite", value: "midnightBlue", color: '#191970' }
    ]
};

// Cinza - Light, Medium, Dark
export const grayColors = {
    light: [
        { label: "Fumaça Branca", value: "whiteSmoke", color: '#F5F5F5' },
        { label: "Gainsboro", value: "gainsboro", color: '#DCDCDC' },
        { label: "Cinza Claro", value: "lightGray", color: '#D3D3D3' },
        { label: "Prata", value: "silver", color: '#C0C0C0' },
        { label: "Cinza Cinzento", value: "ashGray", color: '#B2BEB5' }
    ],
    medium: [
        { label: "Cinza Escuro", value: "darkGray", color: '#A9A9A9' },
        { label: "Cinza", value: "gray", color: '#808080' },
        { label: "Cinza Cálido", value: "warmGray", color: '#A9A9A9' },
        { label: "Cinza Morno", value: "grayStone", color: '#BEBEBE' },
        { label: "Cinza Estanho", value: "pewter", color: '#96A8A8' }
    ],
    dark: [
        { label: "Cinza Escuro", value: "dimGray", color: '#696969' },
        { label: "Cinza Ardósia", value: "slateGray", color: '#708090' },
        { label: "Cinza Ardósia Escuro", value: "darkSlateGray", color: '#2F4F4F' },
        { label: "Preto", value: "black", color: '#000000' },
        { label: "Grafite", value: "graphite", color: '#383838' }
    ]
};

// Roxo - Light, Medium, Dark
export const purpleColors = {
    light: [
        { label: "Lavanda", value: "lavender", color: '#E6E6FA' },
        { label: "Ameixa", value: "plum", color: '#DDA0DD' },
        { label: "Cardo", value: "thistle", color: '#D8BFD8' },
        { label: "Violeta", value: "violet", color: '#EE82EE' },
        { label: "Orquídea", value: "orchid", color: '#DA70D6' }
    ],
    medium: [
        { label: "Orquídea Média", value: "mediumOrchid", color: '#BA55D3' },
        { label: "Púrpura Média", value: "mediumPurple", color: '#9370DB' },
        { label: "Púrpura", value: "purple", color: '#800080' },
        { label: "Índigo", value: "indigo", color: '#4B0082' },
        { label: "Ametista", value: "amethyst", color: '#9966CC' }
    ],
    dark: [
        { label: "Azul Ardósia Escuro", value: "darkSlateBlue", color: '#483D8B' },
        { label: "Púrpura Escura", value: "darkPurple", color: '#301934' },
        { label: "Púrpura Real", value: "royalPurple", color: '#7851A9' },
        { label: "Berinjela", value: "eggplant", color: '#614051' },
        { label: "Violeta Escura", value: "darkViolet", color: '#9400D3' }
    ]
};

// Marrom - Light, Medium, Dark
export const brownColors = {
    light: [
        { label: "Trigo", value: "wheat", color: '#F5DEB3' },
        { label: "Branco Navajo", value: "navajoWhite", color: '#FFDEAD' },
        { label: "Madeira Grossa", value: "burlyWood", color: '#DEB887' },
        { label: "Castanho", value: "tan", color: '#D2B48C' },
        { label: "Marfim", value: "ivory", color: '#FFFFF0' }
    ],
    medium: [
        { label: "Marrom Areia", value: "sandyBrown", color: '#F4A460' },
        { label: "Chocolate", value: "chocolate", color: '#D2691E' },
        { label: "Cobre", value: "copper", color: '#B87333' },
        { label: "Cáqui Escuro", value: "darkKhaki", color: '#BDB76B' },
        { label: "Café", value: "coffee", color: '#6F4E37' }
    ],
    dark: [
        { label: "Peru", value: "peru", color: '#CD853F' },
        { label: "Siena", value: "sienna", color: '#A0522D' },
        { label: "Marrom Sela", value: "saddleBrown", color: '#8B4513' },
        { label: "Marrom Escuro", value: "darkBrown", color: '#654321' },
        { label: "Mogno", value: "mahogany", color: '#4C2F27' }
    ]
};

// Atualizando as paletas
export const palettes = [
    { label: "Cinza Claro", value: "grayLight", colors: grayColors.light },
    { label: "Cinza Médio", value: "grayMedium", colors: grayColors.medium },
    { label: "Cinza Escuro", value: "grayDark", colors: grayColors.dark },
    { label: "Roxo Claro", value: "purpleLight", colors: purpleColors.light },
    { label: "Roxo Médio", value: "purpleMedium", colors: purpleColors.medium },
    { label: "Roxo Escuro", value: "purpleDark", colors: purpleColors.dark },
    { label: "Marrom Claro", value: "brownLight", colors: brownColors.light },
    { label: "Marrom Médio", value: "brownMedium", colors: brownColors.medium },
    { label: "Marrom Escuro", value: "brownDark", colors: brownColors.dark },
    { label: "Vermelho Claro", value: "redLight", colors: redColors.light },
    { label: "Vermelho Médio", value: "redMedium", colors: redColors.medium },
    { label: "Vermelho Escuro", value: "redDark", colors: redColors.dark },
    { label: "Amarelo Claro", value: "yellowLight", colors: yellowColors.light },
    { label: "Amarelo Médio", value: "yellowMedium", colors: yellowColors.medium },
    { label: "Amarelo Escuro", value: "yellowDark", colors: yellowColors.dark },
    { label: "Azul Claro", value: "blueLight", colors: blueColors.light },
    { label: "Azul Médio", value: "blueMedium", colors: blueColors.medium },
    { label: "Azul Escuro", value: "blueDark", colors: blueColors.dark },
    { label: "Verde Claro", value: "greenLight", colors: greenColors.light },
    { label: "Verde Médio", value: "greenMedium", colors: greenColors.medium },
    { label: "Verde Escuro", value: "greenDark", colors: greenColors.dark }
];

// Atualizando os fundos
export const backgroundColors = [
    { label: "Verde", value: "green", bg: greenBackgroundColor },
    { label: "Azul", value: "blue", bg: blueBackgroundColor },
    { label: "Amarelo", value: "yellow", bg: yellowBackgroundColor },
    { label: "Roxo", value: "purple", bg: purpleBackgroundColor },
    { label: "Cinza", value: "gray", bg: grayBackgroundColor },
    { label: "Vermelho", value: "red", bg: redBackgroundColor },
    { label: "Marrom", value: "brown", bg: brownBackgroundColor },
    { label: "Branco", value: "white", bg: whiteBackgroundColor }
];

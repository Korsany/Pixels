document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const render = document.getElementById("css-render");
    const output = document.getElementById("css-output");
    const previewBox = document.querySelector(".preview-box");
    const colorPicker = document.getElementById("color-picker");
    const colorPreviewBorder = document.querySelector(".color-preview");

    const gridSize = 16; 
    const pixelSize = 5; 
    
    previewBox.style.width  = (gridSize * pixelSize) + "px"; 
    previewBox.style.height = (gridSize * pixelSize) + "px";

    let currentColor = colorPicker.value;
    
    let isMouseDown = false;
    let isErasingMode = false; 

    colorPicker.addEventListener("input", (e) => {
        currentColor = e.target.value;
        colorPreviewBorder.style.borderColor = currentColor;
    });

    grid.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    for (let i = 0; i < gridSize * gridSize; i++) {
        const div = document.createElement("div");
        div.classList.add("pixel");
        
        div.addEventListener("mousedown", (e) => {
            e.preventDefault(); 
            isMouseDown = true;

            if (e.button === 2) {
                isErasingMode = true;
                erasePixel(div);
            } else if (e.button === 0) {
                isErasingMode = false;
                paintPixel(div);
            }
        });
        
        div.addEventListener("mouseenter", () => {
            if (isMouseDown) {
                if (isErasingMode) {
                    erasePixel(div);
                } else {
                    paintPixel(div);
                }
            }
        });

        grid.appendChild(div);
    }

    document.addEventListener("mouseup", () => {
        if (isMouseDown) {
            isMouseDown = false;
            updateCSS(); 
        }
    });

    function paintPixel(div) {
        div.classList.add("active");
        div.style.backgroundColor = currentColor;
        div.style.borderColor = currentColor; 
        div.setAttribute("data-color", currentColor);
    }

    function erasePixel(div) {
        div.classList.remove("active");
        div.style.backgroundColor = "";
        div.style.borderColor = ""; 
        div.removeAttribute("data-color");
    }

    function updateCSS() {
        const pixels = document.querySelectorAll(".pixel");
        let shadows = [];

        pixels.forEach((px, index) => {
            if (px.classList.contains("active")) {
                const x = (index % gridSize) * pixelSize;
                const y = Math.floor(index / gridSize) * pixelSize;
                const color = px.getAttribute("data-color") || "#000"; 
                shadows.push(`${x}px ${y}px 0 0 ${color}`);
            }
        });

        if (shadows.length > 0) {
            const finalStyle = shadows.join(", ");
            render.style.boxShadow = finalStyle;
            output.value = `box-shadow: ${finalStyle};`;
        } else {
            render.style.boxShadow = "none";
            output.value = "";
        }
    }
});
const OnDocumentReady = (fn) => {
  if (!fn || typeof fn !== "function") return;
  document.addEventListener("DOMContentLoaded", fn, { once: true });
};

OnDocumentReady(() => {
  const gpanel = document.getElementById("grid-panel");
  UpdateGridSize();

  if (gpanel) {
    for (let i = 0; i < 1500; i++) {
      const element = document.createElement("div");
      element.classList.add("grid-item");
      element.draggable = false;

      gpanel.insertAdjacentElement("beforeend", element);
    }

    document.addEventListener("mousemove", GetMousePosAndPaintGridItems);
    document.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("dragover", (e) => e.preventDefault());
    document.addEventListener("drop", (e) => e.preventDefault());
  }
});

const UpdateGridSize = () => {
  const gpanel = document.getElementById("grid-panel");
  let giw = document.getElementById("giw");

  try {
    let v = parseFloat(giw.value);
    gpanel.style = `grid-template-columns: repeat(50, ${v}px); grid-template-rows: repeat(30, ${v}px);`;
  } catch {
    alert("Please, provide a number for grid item width");
  }
};

const PaintGrid = () => {
  const gpanel = document.getElementById("grid-panel");
  const backgroundc = document.getElementById("backgroundc");

  try {
    gpanel.style.backgroundColor = backgroundc.value;
  } catch {
    alert("Please, provide a color for the grid bg");
  }
};

const PaintGridBorders = () => {
  const gpanel = document.getElementById("grid-panel");
  const borderc = document.getElementById("borderc");

  try {
    Array.from(gpanel.getElementsByClassName("grid-item")).forEach((i) => {
      i.style.borderColor = borderc.value;
    });
  } catch {
    alert("Please, provide a color for the grid border");
  }
};

const GetMousePosAndPaintGridItems = (ev) => {
  const sy = document.getElementById("sy");
  const sx = document.getElementById("sx");
  const brushc = document.getElementById("brushc");

  const { clientX, clientY } = ev;

  sy.innerText = `Y:${clientY}`;
  sx.innerText = `X:${clientX}`;

  if (!brushc) return;
  if ((ev.buttons & 1) === 0) return;

  const under = document.elementFromPoint(clientX, clientY);
  if (!under) return;

  const cell = under.closest(".grid-item");
  if (!cell) return;

  cell.style.backgroundColor = brushc.value;
};

const resetPanel = () => {
  const gpanel = document.getElementById("grid-panel");
  let giw = document.getElementById("giw");
  const brushc = document.getElementById("brushc");
  const borderc = document.getElementById("borderc");
  const backgroundc = document.getElementById("backgroundc");

  if (gpanel) {
    gpanel.style.backgroundColor = "white";
    Array.from(gpanel.getElementsByClassName("grid-item")).forEach((i) => {
      i.style.backgroundColor = "white";
    });

    giw.value = "16";
    brushc.value = "#000000";
    borderc.value = "#000000";
    backgroundc.value = "#ffffff";
    UpdateGridSize();
  }
};

const changeGridLines = (select) => {
  const gpanel = document.getElementById("grid-panel");
  const gridItems = Array.from(gpanel.getElementsByClassName("grid-item"));

  if (select.value === "No") {
    gridItems.forEach((i) => i.classList.add("borderless"));
  } else {
    gridItems.forEach((i) => i.classList.remove("borderless"));
  }
};

const saveSketch = () => {
  const dialog = document.getElementById("saveDialog");
  if (dialog) dialog.showModal();
};

const closeModal = () => {
  const dialog = document.getElementById("saveDialog");
  if (dialog) dialog.close();
};

const genImage = () => {
  const gpanel = document.getElementById("grid-panel");
  const gridItems = Array.from(gpanel.getElementsByClassName("grid-item"));

  const filename = document.getElementById("filename")?.value ?? "untitled";

  const panelBorders = document.getElementById("swpb")?.value;
  const gridLines = document.getElementById("swgl")?.value;
  const transparentBg = document.getElementById("stb")?.value;

  const html2canvasOptions = { useCORS: true };

  if (transparentBg === "Yes") {
    html2canvasOptions["backgroundColor"] = null;
  }

  if (panelBorders === "No") {
    gpanel.style.borderWidth = "0px";
  } else {
    gpanel.style.borderWidth = "1px";
  }

  if (gridLines === "Yes") {
    gridItems.forEach((i) => i.classList.remove("borderless"));
  } else {
    gridItems.forEach((i) => i.classList.add("borderless"));
  }

  try {
    html2canvas(gpanel, html2canvasOptions)
      .then((canvas) => {
        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = `${filename}.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        });
      })
      .catch((err) => console.error("html2canvas error:", err));
  } catch (e) {
    console.log(e);
    alert(`An error occured: ${e}`);
  } finally {
    // Reset to what the values were before
    changeGridLines(document.getElementById("sgl"));
    gpanel.style.borderWidth = "1px";

    closeModal();
  }
};

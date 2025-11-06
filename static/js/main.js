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
    gpanel.style.borderColor = borderc.value;
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

function toggleCanvas(id) {
  for (let i = 1; i <= 2; i++) {
    let iframe = document.getElementById("canvas" + i);
    if (i == id) {
      console.log("display canvas " + i);
      iframe.style.display = "block";
    } else {
      console.log("hide canvas " + i);
      iframe.style.display = "none";
    }
  }
}

function toggleLibrary() {

  let library = document.getElementById("library");
  if (library.style.display == "none" || library.style.display == "") {
    library.style.display = "block";
  } else if (library.style.display == "block") {
    library.style.display = "none";
  }
}
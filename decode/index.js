function download(filename, text) {
  var element = document.getElementById("download");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  document.getElementById("result_textarea").value = text;
  document.getElementById("wrapper").classList.add("decrypted");
}
/* events fired on the drop targets */
document.addEventListener(
  "dragover",
  function(event) {
    // prevent default to allow drop
    event.preventDefault();
  },
  false
);

document.addEventListener(
  "drop",
  function(e) {
    // prevent default action (open as link for some elements)
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      var password = prompt("Please enter your journal's password");
      var content = sjcl.decrypt(password, event.target.result);
      download("journal.md", content);
    };
    reader.readAsText(file);
  },
  false
);

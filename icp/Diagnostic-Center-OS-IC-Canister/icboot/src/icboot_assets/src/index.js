import { icboot } from "../../declarations/icboot";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with icboot actor, calling the greet method
  const greeting = await icboot.greet(name);

  document.getElementById("greeting").innerText = greeting;
});

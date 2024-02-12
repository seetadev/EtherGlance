import { Backend } "../Backend";

let backend = await Backend();

assert (await backend.greet("world")) == "Hello, world!";

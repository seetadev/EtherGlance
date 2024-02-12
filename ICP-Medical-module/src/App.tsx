import { useState } from 'react';
import { backend } from './declarations/backend';
import logo from './assets/logo2.svg';

function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nameInput: HTMLInputElement | null = (
      event.target as HTMLFormElement
    ).querySelector('#name');
    const name = nameInput?.value || '';
    backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main>
      <img src={logo} alt="DFINITY logo" />
      <br />
      <br />
      <form action="#" onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" alt="Name" type="text" />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
}

export default App;

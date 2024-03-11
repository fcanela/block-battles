import { Link } from 'react-router-dom';
import FAQItem from '../components/FAQItem';

export default function FAQPage() {
  return (
    <article className="flex flex-col">
      <FAQItem title="The transaction is mined but it takes a while to reflect in the UI">
        Our providers take some time to provide a succesful answer for some operations. There are two main slow
        operations:
        <ol className="list-decimal pl-16">
          <li>
            When creating a new game, it can take a while to be recognized. The app waits for the transaction receipt
            from the Sepolia RPC to fetch the initial information. This is usually fast, but sometimes it takes minutes
          </li>
          <li>
            When a game is resolved, it can take a while to show the result. The app depends on the Etherscan indexing
            of internal contract trasactions to figure out who won
          </li>
        </ol>
      </FAQItem>

      <FAQItem title="Is the game secure to play?">
        The app provide no guarantees, but the following masures has been provided:
        <ul className="list-disc pl-16">
          <li>
            The nonce has been generated with <span className="font-mono">crypto.getRandomValues</span>, a method to
            generate strong pseudo-random values
          </li>
          <li>The app verifies that the contract you are interacting with is the expected one</li>
          <li>You can only interact with Sepolia, to avoid using a wrong network/account by mistake</li>
          <li>
            The application is SSL only, which avoids attacks like SSL stripping. This also difficults MiTM attacks in
            which the attacker can inject JS code to know your weapon selection or disable your actions to force a
            timeout
          </li>
        </ul>
        There are things thare are not covered though:
        <ul className="list-disc pl-16">
          <li>
            Your local security. The nonce information is stored unencrypted in the LocalStorage. An attacker with
            physical access to your device or a malware installed on it can manipulate the game.
          </li>
          <li>
            SSL pinning, as taking advantadge of this usually requires registering a malicious CA in your local
            environment
          </li>
        </ul>
      </FAQItem>

      <FAQItem title="How is the contract validated?">
        <p>
          The application uses{' '}
          <Link to="https://sepolia.etherscan.io/address/0xba858e1c4b16ca0c421f689ea775bb97be24cabf#code">
            the following verified contract
          </Link>
          , which deploys for each game.
        </p>

        <p>
          To ensure that you don't interact with a game which uses a malicious contract, it checks both the bytecode
          and/or the Etherscan verified contract source code.
        </p>

        <p>
          The deployed bytecode is only available in the nodes for the recent blocks. Etherscan API can provide
          non-reliable results just after creating the contract, at it needs a few minutes to provide a valid match. The
          application checks the bytecode first, and if it's not available it tries with Etherscan.
        </p>
      </FAQItem>

      <FAQItem title="As Player2, I can't see Player1 weapon">
        Not implemented yet. I could have search the P1 reveal transaction in the blocks previous to the rewards
        transactions, but I already implemented things out of scope and have other tasks to close. You can know if you
        won, lost or draw though.
      </FAQItem>

      <FAQItem title="What is the technical stack?">
        React (w/Vite), Redux and Wagmi. It also uses the following resources that requires attribution:
        <ul className="list-disc pl-16">
          <li>
            <Link to="https://etherscan.io/apis">Etherscan Public API</Link>
          </li>
          <li>
            <Link to="https://game-icons.net/">Game Icons</Link>
          </li>
          <li>
            <Link to="https://fontawesome.com">Font Awesome</Link>
          </li>
        </ul>
      </FAQItem>

      <FAQItem title="This looks ugly and is not responsive">
        I admit that beatiful UI creation is not my strongest point, but that or responsive weren't in the scope of this
        exercise.
      </FAQItem>
    </article>
  );
}

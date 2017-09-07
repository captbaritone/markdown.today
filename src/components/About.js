// @flow

import React from "react";

const About = props =>
  <div>
    <h1>About</h1>
    <p>
      Markdown Today is a web-based journaling application that reads and writes
      your journal from a Markdown file stored on your{" "}
      <a href="https://dropbox.com">Dropbox</a> account. It is optimized for the
      following priorities:
      <ul>
        <li>You should be able to read your journal decades from now.</li>
        <li>Your journal deserves the utmost privacy.</li>
        <li>You want to be able to write in your journal from anywhere.</li>
      </ul>
    </p>
    <h2>Forward compatibility</h2>
    <p>
      You should be able to easily read/edit your journal in 10, 20 or 50 years.
      To that end, we store your jounral as the simplest file format: text.
      Markdown is really just a text file with some conventions to make it
      readable. As long as text editors still exist, you should be able to
      read/edit your journal.
    </p>
    <h2>Data storage</h2>
    <p>
      Rather than store your journal on our servers, we have to store it in your
      own Dropbox account. This has a few advantages:
      <ul>
        <li>
          It's easy to have files in your Dropbox account automatically
          synced/backed up to your personal computer.
        </li>
        <li>
          Dropbox is established enougth that it's unlikely to dissapear without
          plenty of forewarning.
        </li>
        <li>
          Users are more likely to trust Dropbox with their hightly personal
          journal than they are to trust me, whom they've never heard of.
        </li>
      </ul>
    </p>
    <h2>Encryption</h2>
    <p>Your journal should be private. </p>
  </div>;

export default About;

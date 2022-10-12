import React from "react";

const Footer = () => {
  return (
    <div>
      <h3 className="text-xl text-center mt-8">
        Made by{" "}
        <a
          href="http://twitter.com/beskay0x"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          beskay
        </a>
        . Open source, see{" "}
        <a
          href="http://github.com/beskay/ethereum-offline-tx"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Github
        </a>
        .
      </h3>
    </div>
  );
};

export default Footer;

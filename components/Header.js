import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Menu } from "semantic-ui-react";

function Header() {
  const router = useRouter();
  const [activeItem, setIsActive] = useState(null);
  return (
    <Menu
      style={{
        marginTop: "10px",
      }}
    >
      <Link href="/">
        <a className="item">Kickstart</a>
      </Link>

      <Menu.Menu position="right">
        <Link href="/">
          <a className="item">Open Campaigns</a>
        </Link>

        <Link href="/campaigns/new">
          <a className="item">Start Now</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
}

export default Header;

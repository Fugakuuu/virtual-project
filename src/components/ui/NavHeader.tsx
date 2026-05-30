"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export interface NavItem {
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface NavHeaderProps {
  items: NavItem[];
}

export function NavHeader({ items }: NavHeaderProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-white/10 bg-[#001e2b]/80 backdrop-blur-md p-1 shadow-lg"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {items.map((item, idx) => (
        <Tab key={idx} setPosition={setPosition} href={item.href} onClick={item.onClick}>
          {item.label}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  href,
  onClick
}: {
  children: React.ReactNode;
  setPosition: any;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer"
    >
      <a
        href={href}
        onClick={onClick}
        className="block px-4 py-2 text-[11px] md:text-[13px] font-mono font-bold tracking-widest uppercase text-white/70 hover:text-[#00ed64] transition-colors duration-300"
      >
        {children}
      </a>
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute z-0 rounded-full bg-[#00ed64]/10 border border-[#00ed64]/30 shadow-[0_0_15px_rgba(0,237,100,0.15)]"
      style={{ top: "0.25rem", bottom: "0.25rem" }}
    />
  );
};

export default NavHeader;

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import assets from '../assets/assets.js';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Slide Tabs Navigation */}
        <SlideTabs />
      </div>
    </nav>
  );
};

const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm p-1"
    >
      <Tab setPosition={setPosition} to="/">Home</Tab>
      <Tab setPosition={setPosition} to="/about">About</Tab>
      <Tab setPosition={setPosition} to="/features">Features</Tab>
      <Tab setPosition={setPosition} to="/contact">Contact Us</Tab>
      <Tab setPosition={setPosition} to="/login">Login</Tab>

      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({ children, setPosition, to }) => {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
    >
      <Link to={to} className="block w-full h-full">
        {children}
      </Link>
    </li>
  );
};

const Cursor = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-7 rounded-full bg-white/20 md:h-12"
    />
  );
};

export default Navbar;
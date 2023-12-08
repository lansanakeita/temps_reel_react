import { FaCaretDown, FaCaretUp, FaCheck } from "react-icons/fa";
import React, { useEffect, useRef, useState } from "react";

const BaseButton = ({
  theme,
  children,
  icon,
  iconPosition = "right",
  onClick,
  splitMode = false,
  options = [],
  dropdownPosition = "bottom",
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const buttonContainerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (dropdownRef.current && buttonContainerRef.current) {
      const buttons = buttonContainerRef.current.firstChild.childNodes;
      const totalWidth = Array.from(buttons).reduce(
        (total, button) => total + button.getBoundingClientRect().width,
        0
      );
      //dropdownRef.current.style.width = `${totalWidth}px`;
    }
  }, [showDropdown]);

  const roundedClasses = splitMode
    ? "rounded-tr-none rounded-br-none"
    : "rounded-lg";

  const getButtonClasses = () => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 p-0.5";

    if (theme === "primary") {
      return `${baseClasses} text-white bg-green-500 hover:bg-green-600`;
    }
    if (theme === "secondary") {
      return `${baseClasses} bg-gray-300 text-gray-700 hover:bg-gray-400`;
    }
    if (theme === "tertiary") {
      return `${baseClasses} bg-transparent text-gray-500 hover:text-gray-700`;
    }
    return baseClasses;
  };

  const getIconClasses = () => {
    const baseClasses = "w-5 h-5 mx-2.5";
    if (iconPosition === "left") {
      return `${baseClasses} order-first`;
    }
    if (iconPosition === "right") {
      return `${baseClasses} order-last`;
    }
    return baseClasses;
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  return (
    <div className="inline-block relative" ref={buttonContainerRef}>
      <div className="flex rounded-lg">
        <button
          className={`${getButtonClasses()} ${roundedClasses} flex flex-grow justify-between`}
          onClick={() => onClick(selectedOption)}
        >
          {icon && iconPosition === "left" && (
            <span className={getIconClasses()}>{icon}</span>
          )}
          <span>{children}</span>
          {icon && iconPosition === "right" && (
            <span className={getIconClasses()}>{icon}</span>
          )}
        </button>
        {splitMode && (
          <>
            <div className="border border-gray-200 h-full"></div>
            <button
              className={`${getButtonClasses()} rounded-l-none`}
              onClick={handleDropdown}
            >
              {showDropdown ? <FaCaretUp /> : <FaCaretDown />}
            </button>
          </>
        )}
      </div>
      {splitMode && showDropdown && (
        <ul
          className={`absolute z-10 bg-white border border-gray-200 rounded shadow-lg mt-1 overflow-y-auto max-h-40 ${
            dropdownPosition === "top" ? "bottom-full mb-1" : "top-full"
          }
          scrollbar-thin scrollbar-thumb-gray-300 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full`}
          ref={dropdownRef}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
              {selectedOption === option && <FaCheck color="#3b82f6" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BaseButton;

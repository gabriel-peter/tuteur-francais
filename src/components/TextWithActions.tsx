import { useState, useRef, useEffect } from "react";
import { Dropdown, DropdownButton, DropdownMenu } from "./catalyst-ui/dropdown";

export function TextWithActions(
    { body, highlightActions }: 
    { body: React.ReactNode, highlightActions: (text: string, closeMenu: () => void) => React.ReactNode }) {
    const [selectedText, setSelectedText] = useState("");
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [showMenu, setShowMenu] = useState(false);
    const textContainerRef = useRef(null);
    const actionsMenuRef = useRef(null);

    // Function to handle text selection and menu positioning
    const handleTextSelection = (event: any) => {
        const selectedText = window?.getSelection()?.toString().trim();
        if (selectedText) {
            const { clientX: x, clientY: y } = event;
            
             // Adjust clientY by adding the current vertical scroll position (window.scrollY)
            const adjustedY = y + window.scrollY;
            const adjustedX = x + window.scrollX;

            console.log({ clientX: adjustedX, clientY: adjustedY })
            setSelectedText(selectedText);
            setMenuPosition({ x: adjustedX, y: adjustedY });
            setShowMenu(true);
        } else {
            setShowMenu(false);
        }
    };
    // Hide menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // if (
            //     textContainerRef.current &&
            //     actionsMenuRef.current &&
            //     !textContainerRef.current.contains(event.target)) {
            //     setShowMenu(false);
            // }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div
                ref={textContainerRef}
                onMouseUp={handleTextSelection}
            // style={{ padding: "20px", border: "1px solid #ddd", cursor: "text" }}
            >
                {body}
            </div>

            {showMenu && (
                <Dropdown >
                    <DropdownButton
                        className="invisible"
                        style={{ // Dummy button used as anchor for menu items.
                            position: "absolute",
                            top: menuPosition.y,
                            left: menuPosition.x,
                            zIndex: 1000,
                        }}
                    />
                    <DropdownMenu
                        static // Ignores internal open controls 
                    // portal={false}
                    // anchor="bottom end"
                    >
                        {highlightActions(selectedText, () => setShowMenu(false))}
                    </DropdownMenu>
                </Dropdown>
            )}
        </div>
    );
}
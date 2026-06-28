"use client";
import React from "react";
import Modal from "react-modal";
import { X } from "lucide-react";

export interface ModalComponentProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    footer?: React.ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    variant?: "modal" | "drawer"; // drawer = sağdan kayan panel
    persistent?: boolean; // true ise overlay tıklayınca veya ESC ile kapanmaz
    drawerWidthClass?: string; // drawer özel genişlik override
}

const ModalCompanentClient: React.FC<ModalComponentProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
    closeOnOverlayClick = true,
    footer,
    headerClassName = "",
    bodyClassName = "",
    footerClassName = "",
    variant = "modal",
    persistent = false,
    drawerWidthClass = "max-w-md", // varsayılan dar çekmece
}) => {
    // Modal'ı uygulamaya bağlama (accessibility için gerekli)
    React.useEffect(() => {
        // #root elemanı varsa setAppElement yap, yoksa (Next.js default) body'yi dene veya atla
        if (typeof window !== "undefined") {
            if (document.getElementById("root")) {
                Modal.setAppElement("#root");
            } else {
                Modal.setAppElement("body");
            }
        }
    }, []);

    // Drawer açıkken body scroll'u kapat
    React.useEffect(() => {
        if (variant === "drawer" && isOpen) {
            const previous = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = previous;
            };
        }
    }, [variant, isOpen]);

    // Size klasları
    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-2xl",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-full mx-4",
    };

    // Overlay stilleri
    const overlayStyles: Modal.Styles =
        variant === "drawer"
            ? {
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.55)",
                    display: "flex",
                    alignItems: "stretch",
                    justifyContent: "flex-end",
                    zIndex: 9999,
                    backdropFilter: "blur(2px)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                content: {
                    position: "relative",
                    inset: "auto",
                    border: "none",
                    background: "transparent",
                    overflow: "visible",
                    padding: 0,
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                },
            }
            : {
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "1rem",
                    backdropFilter: "blur(4px)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                },
                content: {
                    position: "relative",
                    inset: "auto",
                    border: "none",
                    background: "transparent",
                    overflow: "visible",
                    padding: 0,
                    maxHeight: "90vh",
                    width: "100%",
                },
            };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={
                persistent ? undefined : closeOnOverlayClick ? onClose : undefined
            }
            style={overlayStyles}
            closeTimeoutMS={200}
            className={
                variant === "drawer"
                    ? `${drawerWidthClass} w-full h-full outline-none transform transition-transform duration-300 animate-slideInFromRight`
                    : `${sizeClasses[size]} w-full outline-none animate-fadeIn`
            }
            overlayClassName="modal-overlay"
            shouldCloseOnOverlayClick={persistent ? false : closeOnOverlayClick}
            shouldCloseOnEsc={!persistent}
        >
            <div
                className={
                    variant === "drawer"
                        ? "bg-white shadow-xl h-full flex flex-col border-l border-gray-200"
                        : "bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                }
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div
                        className={`
              flex items-center justify-between 
              px-6 py-4 
              border-b border-gray-200 
              bg-linear-to-r from-blue-50 to-white
              ${headerClassName}
            `}
                    >
                        {title && (
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate pr-4">
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="
                  ml-auto shrink-0
                  p-2 
                  rounded-full 
                  hover:bg-gray-100 
                  active:bg-gray-200
                  transition-all duration-200 
                  group
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:ring-offset-2
                "
                                aria-label="Kapat"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div
                    className={`
            px-6 py-6 
            ${variant === "drawer"
                            ? "overflow-y-auto flex-1"
                            : "overflow-y-auto"
                        }
            scrollbar-thin 
            scrollbar-track-gray-100 
            scrollbar-thumb-gray-300
            ${bodyClassName}
          `}
                >
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div
                        className={`
              px-6 py-4 
              border-t border-gray-200 
              bg-gray-50
              ${footerClassName}
            `}
                    >
                        {footer}
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default ModalCompanentClient;

import React from "react";

export interface FormWrapperProps extends React.FormHTMLAttributes<HTMLFormElement> {
    title?: string;
    description?: string;
    error?: string | null;
    children: React.ReactNode;
}

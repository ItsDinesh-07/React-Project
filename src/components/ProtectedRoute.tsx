import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { User, UserRole } from "../types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const currentUserString = localStorage.getItem("currentUser");
  
  if (!currentUserString) {
    // Redirect to login if session does not exist
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user: User = JSON.parse(currentUserString);
    
    // Check if the route restricts entry to specific platform roles
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    localStorage.removeItem("currentUser");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

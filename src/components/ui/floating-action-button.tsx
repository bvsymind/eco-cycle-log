// src/components/ui/floating-action-button.tsx

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  children, 
  className 
}: FloatingActionButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragThreshold = 5; // Minimum pixels to consider it a drag vs click

  // Initialize position to bottom right
  useEffect(() => {
    if (!isInitialized && buttonRef.current) {
      const updatePosition = () => {
        const buttonSize = 56; // FAB size
        const margin = 20; // Margin from edge
        
        setPosition({
          x: window.innerWidth - buttonSize - margin,
          y: window.innerHeight - buttonSize - margin - 80 // 80px for bottom navigation + extra margin
        });
        setIsInitialized(true);
      };

      // Small delay to ensure DOM is ready
      const timer = setTimeout(updatePosition, 100);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isInitialized]);

  // Snap to sides function - keeps button on the sides of screen
  const snapToSide = (currentX: number, currentY: number) => {
    const buttonSize = 56;
    const margin = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const bottomNavHeight = 80; // Bottom navigation height + margin
    
    // Clamp Y position within bounds
    const minY = margin;
    const maxY = screenHeight - buttonSize - margin - bottomNavHeight;
    const clampedY = Math.max(minY, Math.min(maxY, currentY));
    
    // Determine which side is closer (left or right)
    const centerX = screenWidth / 2;
    const snapToLeft = currentX < centerX;
    
    return {
      x: snapToLeft ? margin : screenWidth - buttonSize - margin,
      y: clampedY
    };
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
    
    // Add cursor style to body to show dragging state
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate drag distance for click detection
    const distance = Math.sqrt(
      Math.pow(e.clientX - (position.x + dragStart.x), 2) + 
      Math.pow(e.clientY - (position.y + dragStart.y), 2)
    );
    setDragDistance(distance);
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Reset cursor
    document.body.style.cursor = '';
    
    // If drag distance is small, treat as click
    if (dragDistance < dragThreshold) {
      onClick();
    } else {
      // Snap to nearest side
      const snappedPosition = snapToSide(position.x, position.y);
      setPosition(snappedPosition);
    }
    
    setIsDragging(false);
    setDragDistance(0);
  };

  // Touch events for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({ 
      x: touch.clientX - position.x, 
      y: touch.clientY - position.y 
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Calculate drag distance for tap detection
    const distance = Math.sqrt(
      Math.pow(touch.clientX - (position.x + dragStart.x), 2) + 
      Math.pow(touch.clientY - (position.y + dragStart.y), 2)
    );
    setDragDistance(distance);
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return;
    
    // If drag distance is small, treat as tap
    if (dragDistance < dragThreshold) {
      onClick();
    } else {
      // Snap to nearest side
      const snappedPosition = snapToSide(position.x, position.y);
      setPosition(snappedPosition);
    }
    
    setIsDragging(false);
    setDragDistance(0);
  };

  // Add global event listeners for drag handling
  useEffect(() => {
    if (isDragging) {
      const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
      const handleMouseUpGlobal = (e: MouseEvent) => handleMouseUp(e);
      const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);
      const handleTouchEndGlobal = (e: TouchEvent) => handleTouchEnd(e);

      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
      document.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
      document.addEventListener('touchend', handleTouchEndGlobal);
      
      // Prevent scrolling while dragging on mobile
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveGlobal);
        document.removeEventListener('mouseup', handleMouseUpGlobal);
        document.removeEventListener('touchmove', handleTouchMoveGlobal);
        document.removeEventListener('touchend', handleTouchEndGlobal);
        document.body.style.overflow = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, dragStart, position]);

  // Don't render until position is properly initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        "fixed z-50 w-14 h-14 rounded-full shadow-floating",
        "bg-gradient-primary hover:bg-primary-glow",
        "text-white transition-all duration-200",
        "flex items-center justify-center",
        "touch-none select-none user-select-none", // Prevent text selection and default behaviors
        isDragging 
          ? "cursor-grabbing scale-110 shadow-2xl" 
          : "cursor-grab hover:scale-105 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.1)' : 'scale(1)',
        transition: isDragging 
          ? 'none' 
          : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.15s ease-out'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      // Prevent default button click behavior when dragging
      onClick={(e) => {
        if (dragDistance >= dragThreshold) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      type="button"
      aria-label="Floating action button"
    >
      <span className={cn(
        "transition-transform duration-150",
        isDragging ? "scale-90" : "scale-100"
      )}>
        {children}
      </span>
    </button>
  );
}
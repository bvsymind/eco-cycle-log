// import { useState, useEffect, useRef } from "react";
// import { X, Camera } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import jsQR from "jsqr";


// interface QRScannerModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onScan: (result: string) => void;
// }

// export function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const [error, setError] = useState<string>("");
//   const [jsQRLoaded, setJsQRLoaded] = useState(false);
//   const intervalRef = useRef<NodeJS.Timeout>();

//   // Load jsQR library dynamically with fallback
//   useEffect(() => {
//     const loadJsQR = async () => {
//       try {
//         // Check if jsQR already exists
//         if (window.jsQR) {
//           setJsQRLoaded(true);
//           return;
//         }

//         // Set timeout for loading
//         const timeoutId = setTimeout(() => {
//           setError("Timeout loading QR scanner library. Silakan input ID secara manual.");
//           setJsQRLoaded(true); // Still enable camera
//         }, 10000); // 10 second timeout

//         const script = document.createElement('script');
//         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js';
//         script.async = true;
//         script.crossOrigin = 'anonymous';
        
//         script.onload = () => {
//           clearTimeout(timeoutId);
//           if (window.jsQR) {
//             setJsQRLoaded(true);
//             setError(""); // Clear any previous errors
//           } else {
//             setError("Library loaded but jsQR not available. Silakan input ID secara manual.");
//             setJsQRLoaded(true);
//           }
//         };
        
//         script.onerror = () => {
//           clearTimeout(timeoutId);
//           setError("Gagal memuat library QR scanner. Silakan input ID secara manual.");
//           setJsQRLoaded(true); // Still enable camera for manual verification
//         };
        
//         document.head.appendChild(script);
        
//       } catch (err) {
//         console.error("Error loading jsQR:", err);
//         setError("Error loading QR scanner. Silakan input ID secara manual.");
//         setJsQRLoaded(true);
//       }
//     };

//     loadJsQR();

//     return () => {
//       // Cleanup script if needed
//     };
//   }, []);

//   useEffect(() => {
//     if (isOpen && jsQRLoaded) {
//       startCamera();
//     } else {
//       stopCamera();
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [isOpen, jsQRLoaded]);

//   const startCamera = async () => {
//     try {
//       setError("");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: "environment", // Use back camera if available
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//         setIsScanning(true);
        
//         // Start scanning after video loads
//         videoRef.current.onloadedmetadata = () => {
//           startScanning();
//         };
//       }
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//       setError("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
//     }
//   };

//   const stopCamera = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsScanning(false);
//   };

//   const startScanning = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
    
//     if (!context) return;

//     // Set canvas size to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Scan every 300ms for better performance
//     intervalRef.current = setInterval(() => {
//       if (video.readyState === video.HAVE_ENOUGH_DATA) {
//         // Draw video frame to canvas
//         context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
//         // Get image data for QR detection
//         const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
//         if (window.jsQR) {
//           // Use jsQR to detect QR code
//           try {
//             const qrCode = window.jsQR(imageData.data, imageData.width, imageData.height, {
//               inversionAttempts: "dontInvert"
//             });
            
//             if (qrCode && qrCode.data) {
//               console.log("QR Code detected:", qrCode.data);
//               onScan(qrCode.data);
//               handleClose();
//             }
//           } catch (err) {
//             console.error("Error in QR detection:", err);
//           }
//         }
//       }
//     }, 300);
//   };



//   const handleClose = () => {
//     stopCamera();
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//       <Card className="w-full max-w-md bg-card animate-slide-up">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <Camera className="h-5 w-5" />
//               Scan QR Code
//             </h3>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={handleClose}
//               className="text-muted-foreground hover:text-foreground"
//             >
//               <X className="h-5 w-5" />
//             </Button>
//           </div>

//           <div className="space-y-4">
//             {!jsQRLoaded ? (
//               <div className="text-center p-8">
//                 <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//                 <p className="text-muted-foreground text-sm">Memuat QR Scanner...</p>
//                 <Button 
//                   onClick={() => {
//                     setJsQRLoaded(true);
//                     setError("Loading dilewati. QR scanner mungkin tidak berfungsi optimal.");
//                   }} 
//                   className="mt-4"
//                   variant="outline"
//                   size="sm"
//                 >
//                   Lewati Loading
//                 </Button>
//               </div>
//             ) : error && !window.jsQR ? (
//               <div className="text-center p-8">
//                 <p className="text-destructive text-sm mb-4">{error}</p>
//                 <p className="text-muted-foreground text-sm mb-4">
//                   QR Scanner tidak dapat dimuat. Silakan tutup modal ini dan input ID nasabah secara manual.
//                 </p>
//                 <Button 
//                   onClick={handleClose} 
//                   className="mt-2"
//                   variant="outline"
//                 >
//                   Tutup & Input Manual
//                 </Button>
//               </div>
//             ) : (
//               <div className="relative">
//                 <video
//                   ref={videoRef}
//                   className="w-full h-64 bg-black rounded-lg object-cover"
//                   playsInline
//                   muted
//                 />
                
//                 {/* Scanning overlay */}
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
//                     {/* Corner indicators */}
//                     <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
//                     <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
//                     <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
//                     <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                    
//                     {/* Animated scanning line */}
//                     <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse"></div>
//                   </div>
//                 </div>

//                 {isScanning && window.jsQR && (
//                   <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
//                     Scanning...
//                   </div>
//                 )}
                
//                 {isScanning && !window.jsQR && (
//                   <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
//                     QR Library not loaded
//                   </div>
//                 )}
                
//                 {/* Hidden canvas for image processing */}
//                 <canvas
//                   ref={canvasRef}
//                   className="hidden"
//                 />
//               </div>
//             )}

//             <div className="text-center">
//               <p className="text-sm text-muted-foreground">
//                 {window.jsQR ? 
//                   "Arahkan kamera ke QR code untuk scan ID nasabah" :
//                   "QR Scanner tidak tersedia. Silakan tutup dan input ID secara manual."
//                 }
//               </p>
//             </div>

//             <Button
//               variant="outline"
//               className="w-full"
//               onClick={handleClose}
//             >
//               Tutup
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// }

// export default QRScannerModal;

import { useState, useEffect, useRef } from "react";
import { X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import jsQR from "jsqr";

// Deklarasikan global untuk menambahkan properti jsQR ke window
declare global {
  interface Window {
    jsQR?: typeof jsQR;
  }
}

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (result: string) => void;
}

export function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [jsQRLoaded, setJsQRLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Load jsQR library dynamically with fallback
  useEffect(() => {
    const loadJsQR = async () => {
      try {
        // Check if jsQR already exists
        if (window.jsQR) {
          setJsQRLoaded(true);
          return;
        }

        // Set timeout for loading
        const timeoutId = setTimeout(() => {
          setError("Timeout loading QR scanner library. Silakan input ID secara manual.");
          setJsQRLoaded(true); // Still enable camera
        }, 10000); // 10 second timeout

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        
        script.onload = () => {
          clearTimeout(timeoutId);
          if (window.jsQR) {
            setJsQRLoaded(true);
            setError(""); // Clear any previous errors
          } else {
            setError("Library loaded but jsQR not available. Silakan input ID secara manual.");
            setJsQRLoaded(true);
          }
        };
        
        script.onerror = () => {
          clearTimeout(timeoutId);
          setError("Gagal memuat library QR scanner. Silakan input ID secara manual.");
          setJsQRLoaded(true); // Still enable camera for manual verification
        };
        
        document.head.appendChild(script);
        
      } catch (err) {
        console.error("Error loading jsQR:", err);
        setError("Error loading QR scanner. Silakan input ID secara manual.");
        setJsQRLoaded(true);
      }
    };

    loadJsQR();

    return () => {
      // Cleanup script if needed
    };
  }, []);

  useEffect(() => {
    if (isOpen && jsQRLoaded) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, jsQRLoaded]);

  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Start scanning after video loads
        videoRef.current.onloadedmetadata = () => {
          startScanning();
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  const stopCamera = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Scan every 300ms for better performance
    intervalRef.current = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for QR detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Gunakan non-null assertion karena kita sudah memeriksa di tempat lain
        if (window.jsQR) {
          // Use jsQR to detect QR code
          try {
            const qrCode = window.jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert"
            });
            
            if (qrCode && qrCode.data) {
              console.log("QR Code detected:", qrCode.data);
              onScan(qrCode.data);
              handleClose();
            }
          } catch (err) {
            console.error("Error in QR detection:", err);
          }
        }
      }
    }, 300);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scan QR Code
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            {!jsQRLoaded ? (
              <div className="text-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground text-sm">Memuat QR Scanner...</p>
                <Button 
                  onClick={() => {
                    setJsQRLoaded(true);
                    setError("Loading dilewati. QR scanner mungkin tidak berfungsi optimal.");
                  }} 
                  className="mt-4"
                  variant="outline"
                  size="sm"
                >
                  Lewati Loading
                </Button>
              </div>
            ) : error && !window.jsQR ? (
              <div className="text-center p-8">
                <p className="text-destructive text-sm mb-4">{error}</p>
                <p className="text-muted-foreground text-sm mb-4">
                  QR Scanner tidak dapat dimuat. Silakan tutup modal ini dan input ID nasabah secara manual.
                </p>
                <Button 
                  onClick={handleClose} 
                  className="mt-2"
                  variant="outline"
                >
                  Tutup & Input Manual
                </Button>
              </div>
            ) : (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-black rounded-lg object-cover"
                  playsInline
                  muted
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
                    {/* Corner indicators */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                    
                    {/* Animated scanning line */}
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse"></div>
                  </div>
                </div>

                {isScanning && window.jsQR && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Scanning...
                  </div>
                )}
                
                {isScanning && !window.jsQR && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    QR Library not loaded
                  </div>
                )}
                
                {/* Hidden canvas for image processing */}
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {window.jsQR ? 
                  "Arahkan kamera ke QR code untuk scan ID nasabah" :
                  "QR Scanner tidak tersedia. Silakan tutup dan input ID secara manual."
                }
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleClose}
            >
              Tutup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default QRScannerModal;
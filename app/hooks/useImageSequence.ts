import { useState, useEffect } from "react";

interface UseImageSequenceProps {
    totalFrames: number;
    framePrefix: string;
    frameExtension: string;
}

export function useImageSequence({
    totalFrames,
    framePrefix,
    frameExtension,
}: UseImageSequenceProps) {
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        const loadImages = async () => {
            let lastReportedProgress = 0;

            // Create array of promises for parallel loading
            const loadPromises = Array.from({ length: totalFrames }, (_, i) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    const frameIndex = (i + 1).toString().padStart(3, "0");
                    img.src = `${framePrefix}${frameIndex}${frameExtension}`;

                    const updateProgress = () => {
                        if (isMounted) {
                            loadedCount++;
                            const newProgress = Math.round((loadedCount / totalFrames) * 100);
                            
                            // Throttle: Update only if increased by 5% or finished
                            if (newProgress >= lastReportedProgress + 5 || loadedCount === totalFrames) {
                                setLoadProgress(newProgress);
                                lastReportedProgress = newProgress;
                            }
                            resolve();
                        }
                    };

                    img.onload = () => {
                        if (isMounted) {
                            loadedImages[i] = img;
                            updateProgress();
                        }
                    };

                    img.onerror = () => {
                        console.error(`Failed to load frame ${frameIndex}`);
                        if (isMounted) {
                            updateProgress();
                        }
                    };
                });
            });

            await Promise.all(loadPromises);

            if (isMounted) {
                setImages(loadedImages);
                setIsLoading(false);
            }
        };

        loadImages();

        return () => {
            isMounted = false;
        };
    }, [totalFrames, framePrefix, frameExtension]);

    return { images, isLoading, loadProgress };
}

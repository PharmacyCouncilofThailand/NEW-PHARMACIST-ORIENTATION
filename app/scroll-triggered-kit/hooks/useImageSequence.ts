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
            // Create array of promises for parallel loading
            const loadPromises = Array.from({ length: totalFrames }, (_, i) => {
                return new Promise<void>((resolve) => {
                    const img = new Image();
                    const frameIndex = (i + 1).toString().padStart(3, "0");
                    img.src = `${framePrefix}${frameIndex}${frameExtension}`;

                    img.onload = () => {
                        if (isMounted) {
                            loadedCount++;
                            setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
                            loadedImages[i] = img;
                            resolve();
                        }
                    };

                    img.onerror = () => {
                        console.error(`Failed to load frame ${frameIndex}`);
                        if (isMounted) {
                            loadedCount++;
                            setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
                            resolve();
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

"use client";

import { useState } from "react";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";
import ToggleSwitch from "./ToggleSwitch";
import { Share2 } from "lucide-react";

interface FinishWorkoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (shareToFeed: boolean) => void;
}

export default function FinishWorkoutModal({ isOpen, onClose, onConfirm }: FinishWorkoutModalProps) {
    const [shareToFeed, setShareToFeed] = useState(false);

    const handleConfirm = () => {
        onConfirm(shareToFeed);
        setShareToFeed(false);
    };

    const handleClose = () => {
        setShareToFeed(false);
        onClose();
    };

    return (
        <ModalWrapper isOpen={isOpen} onClose={handleClose} containerClassName="max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-3 mb-5">
                <h3 className="text-lg font-bold text-[var(--foreground)]">Finish Workout?</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Your progress will be saved to your history.</p>
            </div>

            <div className={`mb-5 flex items-center gap-3 rounded-[var(--radius-xl)] p-4 transition-colors ${
                shareToFeed
                    ? "bg-[var(--primary-50)] dark:bg-[var(--primary-100)]"
                    : "bg-[var(--surface-raised)]"
            }`}>
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] ${
                    shareToFeed
                        ? "bg-[var(--primary-500)] text-white"
                        : "bg-[var(--surface)] text-[var(--muted-foreground)]"
                }`}>
                    <Share2 className="size-4" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold text-[var(--foreground)]">Share to your feed</p>
                    <p className="mt-0.5 text-xs leading-5 text-[var(--muted-foreground)]">
                        Let friends see your completed workout.
                    </p>
                </div>
                <ToggleSwitch
                    checked={shareToFeed}
                    onChange={() => setShareToFeed((value) => !value)}
                    size="sm"
                />
            </div>

            <div className="flex gap-3">
                <Button onClick={handleClose} variant="secondary" block>Go Back</Button>
                <Button onClick={handleConfirm} variant="primary" block>Finish</Button>
            </div>
        </ModalWrapper>
    );
}

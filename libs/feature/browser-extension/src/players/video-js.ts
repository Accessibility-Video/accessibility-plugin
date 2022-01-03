import { FrameworkPlayer } from "./framework-player";
import videojs from "video.js";
import { IPlayer } from "@scribit/shared/utils";
import { A11y } from "@scribit/shared/types";

export class VideoJS extends FrameworkPlayer<videojs.Player> implements IPlayer, A11y.Toggle {
    /**
     * returns a array of objects, each object is a reference
     * to a VideoJS player instance.
     */
    protected getScanResults(): videojs.Player[] {
        return Object.values(window.videojs?.players || []);
    }
    /**
     * @inheritDoc
     */
    protected toggleAudioDescription(enabled: boolean): void {
        playerLoop: for (const player of this.players) {
            const tracks = player.tech().audioTracks();
            for (const track of Array.from<{
                kind: string;
                enabled?: boolean;
            }>(tracks)) {
                if (track.kind === "descriptions") {
                    track.enabled = enabled;
                    continue playerLoop;
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    protected toggleClosedCaptioning(enabled: boolean): void {
        playerLoop: for (const player of this.players) {
            const tracks = player.textTracks();
            for (const track of Array.from(tracks)) {
                if (this.toggleCaptionsTrack(enabled, track) !== undefined) {
                    continue playerLoop;
                }
            }

            // If none of the player tracks is used for captions, we add a
            // listener which will listen until a captions text track is added.
            const handleAddTrackEvent = (event: TrackEvent) => {
                if (event.track && this.toggleCaptionsTrack(enabled, event.track) !== undefined) {
                    tracks.removeEventListener("addtrack", handleAddTrackEvent);
                }
            };
            tracks.addEventListener("addtrack", handleAddTrackEvent);
        }
    }

    /**
     * Sets the mode of a captions text track to given state.
     * Return undefined if the track is not a captions text track.
     * Returns false if given track is already in given state.
     * Return true if mode of the captions track has been changed.
     */
    private toggleCaptionsTrack(enabled: boolean, track: TextTrack): boolean | undefined {
        if (track.kind === "captions") {
            const mode = enabled ? "showing" : "disabled";
            if (track.mode === mode) {
                return false;
            }

            track.mode = mode;
            const handleCueChangeEvent = () => {
                track.removeEventListener("cuechange", handleCueChangeEvent);
                track.mode = mode;
            };
            track.addEventListener("cuechange", handleCueChangeEvent);

            return true;
        }
        return undefined;
    }
}

declare global {
    interface Window {
        videojs?: {
            getPlayer?: () => void;
            players: videojs.Player[];
        };
    }
}

import { marked } from "marked";

export class MarkedStreamer {
static new(stream: AsyncGenerator<string>): MarkedStreamer {
        return new MarkedStreamer
        (stream);
    }
    
    private _buffer: string = "";
    private _lastStableLength: number = 0;
    
    constructor(private stream: AsyncGenerator<string>) {}
    
    
}
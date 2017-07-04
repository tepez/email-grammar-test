'use strict';

/**
 Represents the stream of tokens that the parser will consume. The token
 stream can be used to consume tokens, peek ahead, and synchonize to a
 delimiter token.

 When the stream reaches its end, the position is placed at one plus the position
 of the last token.
 */
class TokenStream {
    constructor(stream) {
        this.position = 0;
        this.stream = stream;
    }

    /**
     * Get the next token from the stream and advance the stream. Token can
     * be either a regex or a string.
     */
    getToken(token) {
        // match single character
        if (typeof token === 'string' && token.length === 1) {
            if (this.peek() === token) {
                this.position += 1;
                return token;
            }
            return null;
        }

        // match a pattern
        const match = token.exec(this.stream.substring(this.position));
        if (match) {
            this.position += match[0].length;
            return match[0];
        }

        return null;
    }

    /**
     * Check if the end of the stream has been reached, if it has, returns
     * True, otherwise false.
     */
    endOfStream() {
        return this.position >= this.stream.length;
    }

    /**
     * Peek at the stream to see what the next token is or peek for a specific token.
     */
    peek(token) {
        // peek at whats next in the stream
        if (token == null) {
            return this.position < this.stream.length
                ? this.stream[this.position]
                : null;

        // peek for a specific token
        } else {
            const match = token.exec(this.stream.substring(this.positon));
            return match
                ? match[0]
                : null;
        }
    }
}

module.exports = TokenStream;
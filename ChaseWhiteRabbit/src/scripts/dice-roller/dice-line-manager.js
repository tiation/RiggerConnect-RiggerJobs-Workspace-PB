/**
 * Celtic Dice Roller - Line Manager
 * Manages multiple dice rolling lines with add, remove, duplicate functionality
 */

class DiceLineManager {
    constructor(diceEngine) {
        this.diceEngine = diceEngine;
        this.lines = [];
        this.nextLineId = 1;
        this.defaultLineConfig = {
            count: 1,
            sides: 6,
            modifier: 0,
            applyTo: 'sum', // 'sum' or 'each'
            // Advanced options
            dropHighest: 0,
            dropLowest: 0,
            rerollHighest: 0,
            rerollLowest: 0,
            minCap: null,
            maxCap: null,
            // UI state
            showAdvanced: false,
            label: ''
        };
        
        // Initialize with one default line
        this.addLine();
    }

    /**
     * Create a new dice line with default or provided configuration
     * @param {Object} config - Optional line configuration
     * @returns {Object} - The created line object
     */
    createLine(config = {}) {
        const line = {
            id: this.generateLineId(),
            ...this.defaultLineConfig,
            ...config
        };

        // Ensure label is set
        if (!line.label) {
            line.label = `Line ${line.id}`;
        }

        return line;
    }

    /**
     * Add a new dice line
     * @param {Object} config - Optional line configuration
     * @returns {Object} - The added line
     */
    addLine(config = {}) {
        const line = this.createLine(config);
        this.lines.push(line);
        return line;
    }

    /**
     * Remove a dice line by ID
     * @param {number} lineId - ID of the line to remove
     * @returns {boolean} - Success status
     */
    removeLine(lineId) {
        // Don't allow removing the last line
        if (this.lines.length <= 1) {
            return false;
        }

        const index = this.lines.findIndex(line => line.id === lineId);
        if (index !== -1) {
            this.lines.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Duplicate an existing dice line
     * @param {number} lineId - ID of the line to duplicate
     * @returns {Object|null} - The duplicated line or null if not found
     */
    duplicateLine(lineId) {
        const originalLine = this.getLine(lineId);
        if (!originalLine) {
            return null;
        }

        const duplicatedConfig = { ...originalLine };
        delete duplicatedConfig.id; // Remove ID so new one is generated
        duplicatedConfig.label = `${originalLine.label} (Copy)`;

        const newLine = this.addLine(duplicatedConfig);
        return newLine;
    }

    /**
     * Get a specific dice line by ID
     * @param {number} lineId - ID of the line to retrieve
     * @returns {Object|null} - The line object or null if not found
     */
    getLine(lineId) {
        return this.lines.find(line => line.id === lineId) || null;
    }

    /**
     * Get all dice lines
     * @returns {Array} - Array of all line objects
     */
    getAllLines() {
        return [...this.lines];
    }

    /**
     * Update a dice line configuration
     * @param {number} lineId - ID of the line to update
     * @param {Object} updates - Configuration updates
     * @returns {boolean} - Success status
     */
    updateLine(lineId, updates) {
        const line = this.getLine(lineId);
        if (!line) {
            return false;
        }

        // Validate updates
        if (updates.count !== undefined) {
            updates.count = Math.max(1, Math.min(100, parseInt(updates.count) || 1));
        }
        if (updates.sides !== undefined) {
            updates.sides = Math.max(2, Math.min(100, parseInt(updates.sides) || 6));
        }
        if (updates.modifier !== undefined) {
            updates.modifier = parseInt(updates.modifier) || 0;
        }
        if (updates.applyTo !== undefined && !['sum', 'each'].includes(updates.applyTo)) {
            updates.applyTo = 'sum';
        }

        // Validate advanced options
        ['dropHighest', 'dropLowest', 'rerollHighest', 'rerollLowest'].forEach(key => {
            if (updates[key] !== undefined) {
                updates[key] = Math.max(0, parseInt(updates[key]) || 0);
            }
        });

        ['minCap', 'maxCap'].forEach(key => {
            if (updates[key] !== undefined) {
                const value = parseInt(updates[key]);
                updates[key] = isNaN(value) ? null : Math.max(1, Math.min(100, value));
            }
        });

        // Apply updates
        Object.assign(line, updates);
        return true;
    }

    /**
     * Roll dice for a specific line
     * @param {number} lineId - ID of the line to roll
     * @returns {Object|null} - Roll result or null if line not found
     */
    rollLine(lineId) {
        const line = this.getLine(lineId);
        if (!line) {
            return null;
        }

        const rollConfig = {
            count: line.count,
            sides: line.sides,
            modifier: line.modifier,
            applyTo: line.applyTo,
            dropHighest: line.dropHighest,
            dropLowest: line.dropLowest,
            rerollHighest: line.rerollHighest,
            rerollLowest: line.rerollLowest,
            minCap: line.minCap,
            maxCap: line.maxCap
        };

        const result = this.diceEngine.executeRoll(rollConfig);
        result.lineId = lineId;
        result.lineLabel = line.label;

        return result;
    }

    /**
     * Roll dice for all lines
     * @returns {Array} - Array of roll results for each line
     */
    rollAllLines() {
        return this.lines.map(line => this.rollLine(line.id)).filter(result => result !== null);
    }

    /**
     * Get summary of all lines (without rolling)
     * @returns {Array} - Array of line summaries
     */
    getLinesSummary() {
        return this.lines.map(line => ({
            id: line.id,
            label: line.label,
            expression: this.buildLineExpression(line),
            config: {
                count: line.count,
                sides: line.sides,
                modifier: line.modifier,
                applyTo: line.applyTo,
                hasAdvanced: this.hasAdvancedOptions(line)
            }
        }));
    }

    /**
     * Build expression string for a line
     * @param {Object} line - Line configuration
     * @returns {string} - Expression string
     */
    buildLineExpression(line) {
        let expression = `${line.count}d${line.sides}`;
        
        if (line.dropHighest > 0) {
            expression += `dh${line.dropHighest}`;
        }
        if (line.dropLowest > 0) {
            expression += `dl${line.dropLowest}`;
        }
        if (line.rerollHighest > 0) {
            expression += `rh${line.rerollHighest}`;
        }
        if (line.rerollLowest > 0) {
            expression += `rl${line.rerollLowest}`;
        }
        if (line.minCap) {
            expression += `min${line.minCap}`;
        }
        if (line.maxCap) {
            expression += `max${line.maxCap}`;
        }
        if (line.modifier !== 0) {
            const sign = line.modifier > 0 ? '+' : '';
            expression += `${sign}${line.modifier}`;
            if (line.applyTo === 'each') {
                expression += '(each)';
            }
        }
        
        return expression;
    }

    /**
     * Check if a line has advanced options enabled
     * @param {Object} line - Line configuration
     * @returns {boolean} - Whether line has advanced options
     */
    hasAdvancedOptions(line) {
        return line.dropHighest > 0 || 
               line.dropLowest > 0 || 
               line.rerollHighest > 0 || 
               line.rerollLowest > 0 || 
               line.minCap !== null || 
               line.maxCap !== null;
    }

    /**
     * Move a line to a different position
     * @param {number} lineId - ID of the line to move
     * @param {number} newIndex - New position index
     * @returns {boolean} - Success status
     */
    moveLine(lineId, newIndex) {
        const currentIndex = this.lines.findIndex(line => line.id === lineId);
        if (currentIndex === -1 || newIndex < 0 || newIndex >= this.lines.length) {
            return false;
        }

        // Remove line from current position
        const [line] = this.lines.splice(currentIndex, 1);
        
        // Insert at new position
        this.lines.splice(newIndex, 0, line);
        
        return true;
    }

    /**
     * Clear all lines and add one default line
     */
    resetLines() {
        this.lines = [];
        this.nextLineId = 1;
        this.addLine();
    }

    /**
     * Export all lines configuration
     * @returns {Object} - Exportable configuration
     */
    exportConfiguration() {
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            lines: this.lines.map(line => ({...line}))
        };
    }

    /**
     * Import lines configuration
     * @param {Object} config - Configuration to import
     * @returns {boolean} - Success status
     */
    importConfiguration(config) {
        if (!config || !config.lines || !Array.isArray(config.lines)) {
            return false;
        }

        try {
            this.lines = [];
            this.nextLineId = 1;

            config.lines.forEach(lineConfig => {
                this.addLine(lineConfig);
            });

            // Ensure at least one line exists
            if (this.lines.length === 0) {
                this.addLine();
            }

            return true;
        } catch (error) {
            console.error('Error importing configuration:', error);
            this.resetLines();
            return false;
        }
    }

    /**
     * Generate unique line ID
     * @returns {number} - Unique line identifier
     */
    generateLineId() {
        return this.nextLineId++;
    }

    /**
     * Get total number of lines
     * @returns {number} - Number of lines
     */
    getLineCount() {
        return this.lines.length;
    }

    /**
     * Validate line configuration
     * @param {Object} config - Configuration to validate
     * @returns {Object} - Validated and corrected configuration
     */
    validateLineConfig(config) {
        const validated = {...this.defaultLineConfig, ...config};
        
        // Validate numeric values
        validated.count = Math.max(1, Math.min(100, parseInt(validated.count) || 1));
        validated.sides = Math.max(2, Math.min(100, parseInt(validated.sides) || 6));
        validated.modifier = parseInt(validated.modifier) || 0;
        
        // Validate advanced options
        ['dropHighest', 'dropLowest', 'rerollHighest', 'rerollLowest'].forEach(key => {
            validated[key] = Math.max(0, parseInt(validated[key]) || 0);
        });
        
        ['minCap', 'maxCap'].forEach(key => {
            const value = parseInt(validated[key]);
            validated[key] = isNaN(value) ? null : Math.max(1, Math.min(100, value));
        });
        
        // Validate applyTo
        if (!['sum', 'each'].includes(validated.applyTo)) {
            validated.applyTo = 'sum';
        }
        
        return validated;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiceLineManager;
} else {
    window.DiceLineManager = DiceLineManager;
}

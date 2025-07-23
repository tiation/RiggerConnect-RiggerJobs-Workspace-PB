/**
 * Celtic Dice Roller - Core Engine
 * Handles all dice rolling mechanics and calculations
 */

class DiceEngine {
    constructor() {
        this.history = [];
        this.maxHistorySize = 100;
    }

    /**
     * Roll a single die with given sides
     * @param {number} sides - Number of sides on the die (2-100)
     * @returns {number} - The rolled value
     */
    rollSingleDie(sides) {
        if (sides < 2 || sides > 100) {
            throw new Error('Dice must have between 2 and 100 sides');
        }
        return Math.floor(Math.random() * sides) + 1;
    }

    /**
     * Roll multiple dice and return individual results
     * @param {number} count - Number of dice to roll
     * @param {number} sides - Number of sides per die
     * @returns {Array<number>} - Array of individual die results
     */
    rollMultipleDice(count, sides) {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(this.rollSingleDie(sides));
        }
        return results;
    }

    /**
     * Apply advanced options to dice rolls
     * @param {Array<number>} rolls - Array of die results
     * @param {Object} options - Advanced rolling options
     * @returns {Object} - Processed results with kept/dropped dice
     */
    applyAdvancedOptions(rolls, options = {}) {
        let processedRolls = [...rolls];
        let droppedRolls = [];
        let rerolledRolls = [];

        // Apply min/max capping per die
        if (options.minCap || options.maxCap) {
            processedRolls = processedRolls.map(roll => {
                let cappedRoll = roll;
                if (options.minCap && roll < options.minCap) {
                    cappedRoll = options.minCap;
                }
                if (options.maxCap && roll > options.maxCap) {
                    cappedRoll = options.maxCap;
                }
                return cappedRoll;
            });
        }

        // Handle rerolling
        if (options.rerollHighest || options.rerollLowest) {
            const sortedIndices = processedRolls
                .map((roll, index) => ({ roll, index }))
                .sort((a, b) => a.roll - b.roll);

            let rerollCount = 0;
            if (options.rerollLowest && options.rerollLowest > 0) {
                rerollCount = Math.min(options.rerollLowest, processedRolls.length);
                for (let i = 0; i < rerollCount; i++) {
                    const originalIndex = sortedIndices[i].index;
                    const originalRoll = processedRolls[originalIndex];
                    const newRoll = this.rollSingleDie(options.sides || 6);
                    
                    rerolledRolls.push({
                        original: originalRoll,
                        new: newRoll,
                        index: originalIndex
                    });
                    
                    processedRolls[originalIndex] = newRoll;
                }
            }

            if (options.rerollHighest && options.rerollHighest > 0) {
                rerollCount = Math.min(options.rerollHighest, processedRolls.length);
                const startIndex = sortedIndices.length - rerollCount;
                for (let i = startIndex; i < sortedIndices.length; i++) {
                    const originalIndex = sortedIndices[i].index;
                    const originalRoll = processedRolls[originalIndex];
                    const newRoll = this.rollSingleDie(options.sides || 6);
                    
                    rerolledRolls.push({
                        original: originalRoll,
                        new: newRoll,
                        index: originalIndex
                    });
                    
                    processedRolls[originalIndex] = newRoll;
                }
            }
        }

        // Handle dropping dice
        if (options.dropHighest || options.dropLowest) {
            const sortedWithIndices = processedRolls
                .map((roll, index) => ({ roll, index }))
                .sort((a, b) => a.roll - b.roll);

            let indicesToDrop = [];

            if (options.dropLowest && options.dropLowest > 0) {
                const dropCount = Math.min(options.dropLowest, processedRolls.length - 1);
                for (let i = 0; i < dropCount; i++) {
                    indicesToDrop.push(sortedWithIndices[i].index);
                }
            }

            if (options.dropHighest && options.dropHighest > 0) {
                const dropCount = Math.min(options.dropHighest, processedRolls.length - 1);
                const startIndex = sortedWithIndices.length - dropCount;
                for (let i = startIndex; i < sortedWithIndices.length; i++) {
                    if (!indicesToDrop.includes(sortedWithIndices[i].index)) {
                        indicesToDrop.push(sortedWithIndices[i].index);
                    }
                }
            }

            // Separate kept and dropped dice
            processedRolls.forEach((roll, index) => {
                if (indicesToDrop.includes(index)) {
                    droppedRolls.push({
                        value: roll,
                        index: index
                    });
                }
            });

            // Keep only non-dropped dice
            processedRolls = processedRolls.filter((_, index) => !indicesToDrop.includes(index));
        }

        return {
            keptRolls: processedRolls,
            droppedRolls: droppedRolls,
            rerolledRolls: rerolledRolls
        };
    }

    /**
     * Calculate final result with modifiers
     * @param {Array<number>} rolls - Array of die results to sum
     * @param {Object} modifierConfig - Modifier configuration
     * @returns {Object} - Final calculation results
     */
    calculateResult(rolls, modifierConfig = {}) {
        const baseSum = rolls.reduce((sum, roll) => sum + roll, 0);
        let finalResult = baseSum;
        
        if (modifierConfig.modifier && modifierConfig.modifier !== 0) {
            if (modifierConfig.applyTo === 'each') {
                // Apply modifier to each die individually
                const modifiedRolls = rolls.map(roll => {
                    const modified = roll + modifierConfig.modifier;
                    return Math.max(1, modified); // Ensure minimum of 1
                });
                finalResult = modifiedRolls.reduce((sum, roll) => sum + roll, 0);
                
                return {
                    baseSum: baseSum,
                    modifiedRolls: modifiedRolls,
                    finalResult: finalResult,
                    modifier: modifierConfig.modifier,
                    applyTo: modifierConfig.applyTo
                };
            } else {
                // Apply modifier to sum
                finalResult = baseSum + modifierConfig.modifier;
                
                return {
                    baseSum: baseSum,
                    finalResult: Math.max(rolls.length, finalResult), // Minimum of 1 per die
                    modifier: modifierConfig.modifier,
                    applyTo: modifierConfig.applyTo || 'sum'
                };
            }
        }

        return {
            baseSum: baseSum,
            finalResult: finalResult,
            modifier: 0,
            applyTo: 'sum'
        };
    }

    /**
     * Execute a complete dice roll with all options
     * @param {Object} rollConfig - Complete roll configuration
     * @returns {Object} - Complete roll results
     */
    executeRoll(rollConfig) {
        const {
            count = 1,
            sides = 6,
            modifier = 0,
            applyTo = 'sum',
            dropHighest = 0,
            dropLowest = 0,
            rerollHighest = 0,
            rerollLowest = 0,
            minCap = null,
            maxCap = null
        } = rollConfig;

        // Initial roll
        const initialRolls = this.rollMultipleDice(count, sides);
        
        // Apply advanced options
        const advancedOptions = {
            sides,
            dropHighest,
            dropLowest,
            rerollHighest,
            rerollLowest,
            minCap,
            maxCap
        };
        
        const processedResults = this.applyAdvancedOptions(initialRolls, advancedOptions);
        
        // Calculate final result with modifiers
        const modifierConfig = { modifier, applyTo };
        const calculationResults = this.calculateResult(processedResults.keptRolls, modifierConfig);
        
        // Compile complete result
        const completeResult = {
            id: this.generateRollId(),
            timestamp: new Date(),
            config: rollConfig,
            initialRolls: initialRolls,
            processedResults: processedResults,
            calculation: calculationResults,
            rollExpression: this.buildRollExpression(rollConfig)
        };

        // Add to history
        this.addToHistory(completeResult);
        
        return completeResult;
    }

    /**
     * Generate unique ID for roll
     * @returns {string} - Unique roll identifier
     */
    generateRollId() {
        return 'roll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Build human-readable roll expression
     * @param {Object} config - Roll configuration
     * @returns {string} - Roll expression string
     */
    buildRollExpression(config) {
        let expression = `${config.count}d${config.sides}`;
        
        if (config.dropHighest > 0) {
            expression += `dh${config.dropHighest}`;
        }
        if (config.dropLowest > 0) {
            expression += `dl${config.dropLowest}`;
        }
        if (config.rerollHighest > 0) {
            expression += `rh${config.rerollHighest}`;
        }
        if (config.rerollLowest > 0) {
            expression += `rl${config.rerollLowest}`;
        }
        if (config.minCap) {
            expression += `min${config.minCap}`;
        }
        if (config.maxCap) {
            expression += `max${config.maxCap}`;
        }
        if (config.modifier !== 0) {
            const sign = config.modifier > 0 ? '+' : '';
            expression += `${sign}${config.modifier}`;
            if (config.applyTo === 'each') {
                expression += '(each)';
            }
        }
        
        return expression;
    }

    /**
     * Add roll result to history
     * @param {Object} result - Complete roll result
     */
    addToHistory(result) {
        this.history.unshift(result);
        
        // Limit history size
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }
    }

    /**
     * Get roll history
     * @param {number} limit - Number of recent rolls to return
     * @returns {Array} - Array of roll results
     */
    getHistory(limit = 10) {
        return this.history.slice(0, limit);
    }

    /**
     * Clear roll history
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * Get statistics for recent rolls
     * @param {number} limit - Number of recent rolls to analyze
     * @returns {Object} - Roll statistics
     */
    getStatistics(limit = 50) {
        const recentRolls = this.getHistory(limit);
        
        if (recentRolls.length === 0) {
            return null;
        }

        const results = recentRolls.map(roll => roll.calculation.finalResult);
        const sum = results.reduce((a, b) => a + b, 0);
        const average = sum / results.length;
        const min = Math.min(...results);
        const max = Math.max(...results);

        return {
            totalRolls: recentRolls.length,
            average: Math.round(average * 100) / 100,
            min: min,
            max: max,
            sum: sum
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiceEngine;
} else {
    window.DiceEngine = DiceEngine;
}

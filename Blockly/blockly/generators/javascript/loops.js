/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating JavaScript for loop blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.JavaScript.loops');

goog.require('Blockly.JavaScript');


Blockly.JavaScript['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(Number(block.getFieldValue('TIMES')));
  } else {
    // External number.
    var repeats = Blockly.JavaScript.valueToCode(block, 'TIMES',
        Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  }
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = '';
  var loopVar = Blockly.JavaScript.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.JavaScript.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + endVar + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};

Blockly.JavaScript['controls_repeat'] =
    Blockly.JavaScript['controls_repeat_ext'];

Blockly.JavaScript['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.JavaScript.valueToCode(block, 'BOOL',
      until ? Blockly.JavaScript.ORDER_LOGICAL_NOT :
      Blockly.JavaScript.ORDER_NONE) || 'false';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

Blockly.JavaScript['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.JavaScript.valueToCode(block, 'FROM',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.JavaScript.valueToCode(block, 'TO',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.JavaScript.valueToCode(block, 'BY',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code;
  // 2018/10/10
  var checkbox_order = block.getFieldValue('ORDER') == 'TRUE';   // ASC or DESC for loop   
  if (checkbox_order) {    // 遞增迴圈
        if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1)) {
             // 2 arguments are simple numbers.
             if (parseFloat(argument0) <= parseFloat(argument1)){
                   // 範圍是從小到大
                   code = 'for (' + variable0 + '=' + argument0 + '; ' +
                        variable0 + '<=' + argument1 + '; ' +  variable0;
             }
             else {    // 範圍是從大到小
                   code = 'for (' + variable0 + '=' + argument1 + '; ' +
                        variable0 + '<=' + argument0 + '; ' +  variable0;
             }      
        }
        else {    // 範圍有變數
             code = 'for (' + variable0 + '=' + argument0 + '; ' +
                  variable0 + '<=' + argument1 + '; ' +  variable0;
        }          
  }
  else {      // 遞減迴圈
        if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1)) {
             // 2 arguments are simple numbers.
             if (parseFloat(argument0) <= parseFloat(argument1)){
                   // 範圍是從小到大
                   code = 'for (' + variable0 + '=' + argument1 + '; ' +
                        variable0 + '>=' + argument0 + '; ' +  variable0;
             }
             else {    // 範圍是從大到小
                   code = 'for (' + variable0 + '=' + argument0 + '; ' +
                        variable0 + '>=' + argument1 + '; ' +  variable0;
             }      
        }
        else {    // 範圍有變數
            code = 'for (' + variable0 + '=' + argument0 + '; ' +
                  variable0 + '>=' + argument1 + '; ' +  variable0;
        }          
  }
  if (Blockly.isNumber(increment)) {      // 增量
     var step = Math.abs(parseFloat(increment));
     if (step == 1) {
         code += checkbox_order ? '++' : '--';
     } else {
         code += (checkbox_order ? '+=' : '-=') + step;
     }      
  }
  else {
     code += (checkbox_order ? '+=' : '-=') + increment;
  }
  code += ') {\n' + branch + '}\n';
 
  return code;
};

Blockly.JavaScript['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.JavaScript.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.JavaScript.valueToCode(block, 'LIST',
      Blockly.JavaScript.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  branch = Blockly.JavaScript.addLoopTrap(branch, block.id);
  var code = '';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  var listVar = argument0;
  if (!argument0.match(/^\w+$/)) {
    listVar = Blockly.JavaScript.variableDB_.getDistinctName(
        variable0 + '_list', Blockly.Variables.NAME_TYPE);
    code += 'var ' + listVar + ' = ' + argument0 + ';\n';
  }
  var indexVar = Blockly.JavaScript.variableDB_.getDistinctName(
      variable0 + '_index', Blockly.Variables.NAME_TYPE);
  branch = Blockly.JavaScript.INDENT + variable0 + ' = ' +
      listVar + '[' + indexVar + '];\n' + branch;
  code += 'for (var ' + indexVar + ' in ' + listVar + ') {\n' + branch + '}\n';
  return code;
};

Blockly.JavaScript['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};

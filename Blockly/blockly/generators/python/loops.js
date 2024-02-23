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
 * @fileoverview Generating Python for loop blocks.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Python.loops');

goog.require('Blockly.Python');


Blockly.Python['controls_repeat_ext'] = function(block) {
  // Repeat n times.
  if (block.getField('TIMES')) {
    // Internal number.
    var repeats = String(parseInt(block.getFieldValue('TIMES'), 10));
  } else {
    // External number.
    var repeats = Blockly.Python.valueToCode(block, 'TIMES',
        Blockly.Python.ORDER_NONE) || '0';
  }
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = 'int(' + repeats + ')';
  }
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var loopVar = Blockly.Python.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
  return code;
};

Blockly.Python['controls_repeat'] = Blockly.Python['controls_repeat_ext'];

Blockly.Python['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Python.valueToCode(block, 'BOOL',
      until ? Blockly.Python.ORDER_LOGICAL_NOT :
      Blockly.Python.ORDER_NONE) || 'False';
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  if (until) {
    argument0 = 'not ' + argument0;
  }
  return 'while ' + argument0 + ':\n' + branch;
};

Blockly.Python['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.Python.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Python.valueToCode(block, 'FROM',
      Blockly.Python.ORDER_NONE) || '0';
  var argument1 = Blockly.Python.valueToCode(block, 'TO',
      Blockly.Python.ORDER_NONE) || '0';
  var increment = Blockly.Python.valueToCode(block, 'BY',
      Blockly.Python.ORDER_NONE) || '1';
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;

  var code = '';
  var range;
  var checkbox_order = block.getFieldValue('ORDER') == 'TRUE';   // ASC or DESC for loop
  if (Blockly.isNumber(argument0) && Blockly.isNumber(argument1) &&
      Blockly.isNumber(increment)) {
    // All parameters are simple numbers.
    argument0 = parseFloat(argument0);
    argument1 = parseFloat(argument1);
    increment = Math.abs(parseFloat(increment));
    if (argument0 % 1 === 0 && argument1 % 1 === 0 && increment % 1 === 0) {
      if (checkbox_order) {   // 遞增迴圈
           if (argument0 > argument1) {      // 範圍的順序錯誤
               var temp = argument0;
               argument0 = argument1;
               argument1 = temp;
           }      
      }
      else {    // 遞減迴圈
           if (argument0 < argument1) {      // 範圍的順序錯誤
               var temp = argument0;
               argument0 = argument1;
               argument1 = temp;
           }    
      }
      // All parameters are integers.
      if (argument0 <= argument1) {
        // Count up.
        argument1++;
        if (argument0 == 0 && increment == 1) {
          // If starting index is 0, omit it.
          range = argument1;
        } else {
           if (increment == 1) {
               range = argument0 + ', ' + argument1
           }
           else {
              range = argument0 + ', ' + argument1 + ', ' + increment;            
           }           
        }
      } else {
        // Count down.
        argument1--;
        range = argument0 + ', ' + argument1 + ', -' + increment;
      }
      range = 'range(' + range + ')';
    } else {
      // 有一個參數不是整數, 可能是浮點數或變數
      var argu0 = argument0;
      if (Blockly.isNumber(argument0))  {         // 是數字
          if (!(argument0 % 1 === 0)) {
              argu0 =  'int(' + argument0 + ')';  // 是浮點數
          }          
      } 
      else {
          argu0 =  'int(' + argument0 + ')';      // 是變數
      }
      if (checkbox_order) {     // 遞增迴圈
           if (Blockly.isNumber(argument1) && argument1 % 1 === 0) {
               argument1++;
               range = 'range(' + argu0 + ', ' + argument1 + ', ' + increment + ')';
           }
           else {
               range = 'range(' + argu0 + ', int(' + argument1 + ')+1, ' + increment + ')';
           }    
      }
      else {
          if (Blockly.isNumber(argument1) && argument1 % 1 === 0) {
               argument1--;      
               range = 'range(' + argu0 + ', ' + argument1 + ', -' + increment + ')'; 
          }
          else {
               range = 'range(' + argu0 + ', int(' + argument1 + ')-1, -' + increment + ')'; 
          }     
      }
    }
  } else {
      var argu0 = argument0;
      if (Blockly.isNumber(argument0))  {    // 是數字
          if (!(argument0 % 1 === 0)) {
              argu0 =  'int(' + argument0 + ')';  // 是浮點數
          }          
      } 
      else {
          argu0 =  'int(' + argument0 + ')';      // 是變數
      }
      if (checkbox_order) {     // 遞增迴圈
           if (Blockly.isNumber(argument1) && argument1 % 1 === 0) {
               argument1++;
               range = 'range(' + argu0 + ', ' + argument1 + ', ' + increment + ')';
           }
           else {
               range = 'range(' + argu0 + ', int(' + argument1 + ')+1, ' + increment + ')';
           }    
      }
      else {
          if (Blockly.isNumber(argument1) && argument1 % 1 === 0) {
               argument1--;      
               range = 'range(' + argu0 + ', ' + argument1 + ', -' + increment + ')'; 
          }
          else {
               range = 'range(' + argu0 + ', int(' + argument1 + ')-1, -' + increment + ')'; 
          }     
      }
  }
  code += 'for ' + variable0 + ' in ' + range + ':\n' + branch; 
  return code;
};

Blockly.Python['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Python.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Python.valueToCode(block, 'LIST',
      Blockly.Python.ORDER_RELATIONAL) || '[]';
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var code = 'for ' + variable0 + ' in ' + argument0 + ':\n' + branch;
  return code;
};

Blockly.Python['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break\n';
    case 'CONTINUE':
      return 'continue\n';
  }
  throw 'Unknown flow statement.';
};

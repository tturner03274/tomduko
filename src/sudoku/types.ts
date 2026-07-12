export type Digit = 1|2|3|4|5|6|7|8|9;
export type CellValue = Digit|0;
export type Grid = readonly CellValue[];
export interface CellCoordinate { row:number; col:number }
export type Difficulty = 'easy'|'medium'|'hard'|'expert';
export type TechniqueId = 'naked-single'|'hidden-single'|'locked-candidate'|'naked-pair';
export interface Puzzle { id:string; puzzle:string; solution:string; difficulty:Difficulty; clueCount:number; techniques:TechniqueId[]; seed:string }
export interface SudokuHint { technique:TechniqueId; title:string; explanation:string; focusCells:CellCoordinate[]; targetCell?:CellCoordinate; targetDigit?:Digit; canApply:boolean }
export const DIGITS:readonly Digit[]=[1,2,3,4,5,6,7,8,9];
export const indexOf=({row,col}:CellCoordinate)=>row*9+col;
export const coordinateOf=(index:number):CellCoordinate=>({row:Math.floor(index/9),col:index%9});

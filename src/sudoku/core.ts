import { coordinateOf,DIGITS,indexOf,type CellCoordinate,type CellValue,type Digit,type Grid } from './types';
export function validatePuzzleShape(value:unknown):value is string{return typeof value==='string'&&/^[0-9.]{81}$/.test(value)}
export function parsePuzzle(value:string):Grid{if(!validatePuzzleShape(value))throw new Error('Puzzle must contain exactly 81 digits or dots.');return Object.freeze([...value].map(c=>(c==='.'?0:Number(c)) as CellValue))}
export function serializePuzzle(grid:Grid):string{assertGrid(grid);return grid.join('')}
export function assertGrid(grid:Grid):void{if(grid.length!==81||grid.some(v=>!Number.isInteger(v)||v<0||v>9))throw new Error('Invalid Sudoku grid.')}
export function rowPeers(index:number):number[]{const r=Math.floor(index/9);return Array.from({length:9},(_,c)=>r*9+c).filter(i=>i!==index)}
export function columnPeers(index:number):number[]{const c=index%9;return Array.from({length:9},(_,r)=>r*9+c).filter(i=>i!==index)}
export function boxPeers(index:number):number[]{const {row,col}=coordinateOf(index),br=Math.floor(row/3)*3,bc=Math.floor(col/3)*3;return Array.from({length:9},(_,i)=>(br+Math.floor(i/3))*9+bc+i%3).filter(i=>i!==index)}
export function peers(index:number):number[]{return [...new Set([...rowPeers(index),...columnPeers(index),...boxPeers(index)])]}
export function validDigits(grid:Grid,index:number):Digit[]{if(grid[index])return [];const used=new Set(peers(index).map(i=>grid[i]));return DIGITS.filter(d=>!used.has(d))}
export function conflicts(grid:Grid,index?:number):Set<number>{const found=new Set<number>();const units:number[][]=[];for(let n=0;n<9;n++){units.push(Array.from({length:9},(_,i)=>n*9+i),Array.from({length:9},(_,i)=>i*9+n));}for(let br=0;br<3;br++)for(let bc=0;bc<3;bc++)units.push(Array.from({length:9},(_,i)=>(br*3+Math.floor(i/3))*9+bc*3+i%3));for(const unit of units){const by=new Map<number,number[]>();for(const i of unit)if(grid[i])by.set(grid[i],(by.get(grid[i])??[]).concat(i));for(const indices of by.values())if(indices.length>1)indices.forEach(i=>found.add(i));}if(index===undefined)return found;return found.has(index)?new Set([...found].filter(i=>i===index||peers(index).includes(i)&&grid[i]===grid[index])):new Set()}
export const validateGivens=(grid:Grid)=>{try{assertGrid(grid);return conflicts(grid).size===0}catch{return false}};
export const isComplete=(grid:Grid,solution?:Grid)=>grid.every(Boolean)&&conflicts(grid).size===0&&(!solution||grid.every((v,i)=>v===solution[i]));
export const isInvalidCompletion=(grid:Grid)=>grid.every(Boolean)&&conflicts(grid).size>0;
export function applyMove(grid:Grid,index:number,value:CellValue,givens?:Grid):Grid{assertGrid(grid);if(index<0||index>80)throw new Error('Invalid cell.');if(givens?.[index])return grid;const next=[...grid];next[index]=value;return Object.freeze(next)}
export const clearMove=(grid:Grid,index:number,givens?:Grid)=>applyMove(grid,index,0,givens);
export const calculateCandidates=(grid:Grid):ReadonlyMap<number,readonly Digit[]>=>new Map(grid.map((v,i)=>[i,v?[]:validDigits(grid,i)]));
export const affectedCells=(coord:CellCoordinate)=>peers(indexOf(coord));
export const compareWithSolution=(grid:Grid,solution:Grid)=>grid.map((v,i)=>v!==0&&v!==solution[i]);

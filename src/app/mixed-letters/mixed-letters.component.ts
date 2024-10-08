import { Component , Input, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../../shared/model/category';
import { FormsModule } from '@angular/forms';
import { ExitButtonComponent } from "../exit-button/exit-button.component";
import { ProgressBarComponent } from "../progress-bar/progress-bar.component";
import { PointsDisplayComponent } from "../points-display/points-display.component";
import { ResetButtonComponent } from "../reset-button/reset-button.component";
import { TranslatedWord } from '../../shared/model/translated-word';
import { SummaryScreenComponent } from "../summary-screen/summary-screen.component";
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { GameService } from '../services/user-activity.service';
import { GameResult } from '../../shared/model/game-result';
@Component({
  selector: 'app-mixed-letters',
  standalone: true,
  imports: [FormsModule, CommonModule,MatButtonModule,MatInputModule,ExitButtonComponent, ProgressBarComponent, PointsDisplayComponent, ResetButtonComponent, SummaryScreenComponent],
  templateUrl: './mixed-letters.component.html',
  styleUrl: './mixed-letters.component.css'
})

export class MixedLettersComponent implements OnInit {
@Input() id!: any;
category!: Category;
currentWordIndex = 0;
points = 0;
words: TranslatedWord[] = [];
usrGuess: object[] = [];
  jumbledWord = this.jumbleWord('');
  userInput = '';
public isGameHasFinished: boolean = false;
 constructor(private catService: CategoriesService,private gameResultServ: GameService) { }

  ngOnInit() {
    this.getCategory().then(
    ()=> {
      this.jumbledWord = this.jumbleWord(this.words[this.currentWordIndex].origin);
      this.isGameHasFinished= false
    });
  }

  jumbleWord(word: string): string {
    return word.split('').sort(() => 0.5 - Math.random()).join('');
  }

   async checkWord() {
    console.log(this.currentWordIndex,this.words.length -1)
    if (this.currentWordIndex === this.words.length - 1) {
      this.isGameHasFinished = true;
      //FINISH!
    }
    if (this.userInput === this.words[this.currentWordIndex].origin) {
      this.points += Math.floor(100 / this.words.length);
      alert('Success')

    let guess = { origin: this.words[this.currentWordIndex].target, target: this.userInput , status: 'Succeeded', points: this.points, catID: this.id}
      this.usrGuess.push(guess)
    } else {
      alert('Failed')
      let guess = { origin: this.words[this.currentWordIndex].target, target: this.userInput , status: 'Failed', points: this.points, catID: this.id}
      this.usrGuess.push(guess)

    }
    this.currentWordIndex++;
    if (this.currentWordIndex < this.words.length) {
       this.jumbledWord = this.jumbleWord(this.words[this.currentWordIndex].origin);
       this.userInput = '';
    } 
  }
  
 async getCategory() {
   await this.catService.get(this.id).then(
      (catgoryFromService) => {
      if (catgoryFromService) {
      this.category = catgoryFromService;
      }
      }
      );
    this.getWords();
  }
  getWords() {
    return this.words = this.category!.words;
  }
async finishGame() {
      // add to game result
      const game = new GameResult('Mixed-Letters',this.category.id,new Date(),this.points)
      await this.gameResultServ.addGameResult(game)
  }
}

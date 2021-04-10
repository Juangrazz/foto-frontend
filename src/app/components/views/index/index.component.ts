import { Component, OnInit } from '@angular/core';
import { CardService } from '../../../services/card.service';
import { ControlService } from '../../../services/control.service';
import { DatabaseService } from '../../../services/database.service';

import { MymyvCardModel } from '../../../models/mymyv_card.model';
import { CardModel } from 'src/app/models/card.model';

import * as moment from 'moment';
import keys from '../../../../keys';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  keys = keys;

  noPosts: boolean = true;
  cards: CardModel[] = [];
  mymyvCards: MymyvCardModel[] = [];
  allCards: any[] = [];
  showNavAndFoot: boolean = true;

  page: number = 1;
  dateToShow: string = moment().format("DD-MM-YYYY");
  dateNext!: string;
  dateBack!: string;

  constructor(private cardService: CardService, private controlService: ControlService, private databseService: DatabaseService) {
    this.getAllCards();
    this.checkCards();
    this.controlService.showNavAndFoot.next(true);
    this.controlService.isAdmin.next(false);
    this.calculateDay();
  }

  ngOnInit(): void {
  }

  async getAllCards() {
    this.allCards = [];
    
    const cards = await this.databseService.getCards(this.dateToShow);
    const mymyvCards = await this.databseService.getMymyvCards(this.dateToShow);
    
    for (const card of cards) {
      card.model_type = keys.ctrl_model_card_type_1;
      this.allCards.push(card);
    }
    for (const card of mymyvCards) {
      card.model_type = keys.ctrl_model_card_type_2;
      this.allCards.push(card);
    }
    this.allCards.sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
    
    this.checkCards();
  }


  checkCards() {
    if (this.allCards.length === 0) {
      this.noPosts = true;
    } else {
      this.noPosts = false;
    }
  }


  saveCard(card: CardModel) {
    sessionStorage.setItem("individual_card", JSON.stringify(card));
    this.cardService.individualCard = card;
  };

  calculateDay() {
    this.dateBack = moment(this.dateToShow, "DD-MM-YYYY").subtract(1, "days").format("DD");
    this.dateNext = moment(this.dateToShow, "DD-MM-YYYY").add(1, "days").format("DD");
  }

  addDay() {
    this.dateToShow = moment(this.dateToShow, "DD-MM-YYYY").add(1, "days").format("DD-MM-YYYY");
    this.calculateDay();
    this.getAllCards();
  }

  subtractDay() {
    this.dateToShow = moment(this.dateToShow, "DD-MM-YYYY").subtract(1, "days").format("DD-MM-YYYY");
    this.calculateDay();
    this.getAllCards();
  }

}

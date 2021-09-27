import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { APIResponse, Game } from '../../models';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public sort: string;
  public games: Array<Game>;
  private routeSubscription: Subscription;
  private gameSubscription: Subscription;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
   this.routeSubscription = this.activatedRoute.params.subscribe((params: Params)=>{
      if(params['game-search']){
        this.searchGames('metacrit', params['game-search']);
      }
      else{
        this.searchGames('metacrit');
      }
    });
  }

  searchGames(sort: string, search?: string): void{
    this.gameSubscription = this.httpService
      .getGameList(sort, search)
      .subscribe((gameList:APIResponse<Game>)=>{
        this.games = gameList.results;
        console.log(gameList);
      });
  }
  openGameDetails(id:string): void {
    this.router.navigate(['details', id]);
  }

  ngOnDestroy(): void{
    if(this.gameSubscription){
      this.gameSubscription.unsubscribe();
    }
    if(this.routeSubscription){
      this.routeSubscription.unsubscribe();
    }
  }

}

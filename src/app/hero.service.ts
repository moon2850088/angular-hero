import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  private heroesUrl ='api/heroes'; 

  

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) { 
    this.messageService.add(`HeroService: ${message}`);
  }

  private handleError<T> (operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    }
  }

  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetch heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes',[]))
    );
  }

  getHero(id: number): Observable<Hero> {
   const url = `${this.heroesUrl}/${id}`;
   return this.http.get<Hero>(url).pipe(
     tap(_ => this.log(`fetched hero id=${id}`)),
     catchError(this.handleError<Hero>(`getHero id=${id}`))
   );
  }

  updateHero (hero:Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    )
  }

}

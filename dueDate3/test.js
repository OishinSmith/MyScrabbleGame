//This is just some testing I was doing
//a rough implementation of the getScore from letters function is made.
//the input has changed for that function, so atm, I dont know what's what.
//what I thought the board was before ----->assuming input is a list of words and multipliers eg (["cat","mat"],["123","342"])
//The is still being made, so i dont know if its still a matrix of numbers or if its letters eg. "tw", "dw" etc.

var board=["1111CAR22234222",
           "3333A4A44444444",
           "1111TO111111111",
           "111111111111111",
           "222222222222222"];

list_of_words = []
for(i=0;i<board.length;i++)
{
  var string = "";
  for(j=0; j<board[i].length ;j++)
  {
    
    if(!"1234".includes(board[i][j]))
    {
          string = string + board[i][j];
    }
    else if(string != ""){
      list_of_words.push(string);
      string = ""
    }
  }
  
  list_of_words.push(string);
}

var i = 0;
var j = 0;
while(i < board[0].length)
  {
    var k = 0;
    
    var string = "";
    while(k < board.length)
    {
      if(!"1234".includes(board[k][j]))
      {
          string = string + board[k][j];
      }
      else if(string != "")
      {
        list_of_words.push(string);
        string = ""
      }
      k = k + 1;
    }
    i = i + 1;
    j = j + 1;
    list_of_words.push(string);
  }

  
for(i=0;i<list_of_words.length; i++)
{
  if(list_of_words[i].length > 1)
    {
      console.log(list_of_words[i]);
    }
}


function letterScore(c){ //get letter score value
  if("abcdefghijk".includes(c)) //if value value of c in "abcdefghijk" return letter score
      {
 		    score= 1;
      }
      else if("lmnopqrstu".includes(c))
      {
        score= 2;
      }
      else if("vwxyz".includes(c))
      {
        score=3;
      }
      return score
}

function getScore(b) { //assuming input is a list of words and multipliers eg (["cat","mat"],["123","342"]), and multiple is in a dictionary.
total = 0;                                                                   // ^valid strings   ^multipliers taken from board
score=0;
letters = b[0];
multiplier = b[1];
for(i=0;i<letters.length;i++)
	  {
      total = total + letterScore(letters[i]);
		}
  //console.log(multiple.b[1]);
  //score = total * multiple.b[1];
  if(multiplier=="dw")
  {
    return total * 2
  }
  else if(multiplier=="tw")
  {
    return total*3
  }
}

return



//console.log(getScore([["cats"],["1113"]));
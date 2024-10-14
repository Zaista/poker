$(document).ready(function () {
  // GAMEPLAY //
  let cardHeight = 173
  let cardWidth = 124

  // hold the session's hi-score
  let sessionScore = 0
  let totalScore = 0

  // represents an index of a next card that will be drawn from the deck
  let activeCard = 0

  // this will add up throughout the game so that cards that are drown latter will always be on top
  let zIndex = 100

  // how many cards are pulled this round (1 - 5)
  let card = 1

  // round of a game (1 - 5)
  let round = 1

  // TODO add explanation
  let offset = 30
  let margin = 100
  if ($('.card').width() === 60) {
    offset = 15
    margin = 60
    cardHeight = 83
    cardWidth = 60
  }

  // this will hold user hands
  let hands = [[], [], [], [], []]

  // deck of cards
  let cards = [
    '01s',
    '02s',
    '03s',
    '04s',
    '05s',
    '06s',
    '07s',
    '08s',
    '09s',
    '10s',
    '11s',
    '12s',
    '13s',
    '01c',
    '02c',
    '03c',
    '04c',
    '05c',
    '06c',
    '07c',
    '08c',
    '09c',
    '10c',
    '11c',
    '12c',
    '13c',
    '01h',
    '02h',
    '03h',
    '04h',
    '05h',
    '06h',
    '07h',
    '08h',
    '09h',
    '10h',
    '11h',
    '12h',
    '13h',
    '01d',
    '02d',
    '03d',
    '04d',
    '05d',
    '06d',
    '07d',
    '08d',
    '09d',
    '10d',
    '11d',
    '12d',
    '13d',
  ]

  // hold the interval
  let setFirstFive

  // shuffle the cards before each game
  shuffle(cards)

  // start the game and draw the first five cards
  startGame()

  // get the scoreboard
  let scoreboard = []

  getScoreboard()

  // adjust layout
  $(
    '<style>.cards { width: ' +
      cardWidth +
      '; height: ' +
      cardHeight +
      '}</style>'
  ).appendTo('head')

  let wrapperWidth = cardWidth * 5 + 5 * 2 * 2
  $('#play-div-wrapper, #head-div-wrapper, #results-div-wrapper').width(
    wrapperWidth
  )
  $('#results-div-wrapper span').width(cardWidth)

  $('#play-div').height('+=' + offset * 4 + 'px')

  $('#restart').click(function () {
    $('html,body').animate({ scrollTop: 0 }, 'slow')
    removeCards()
    resetGame()
    startGame()
  })

  // handle user score submit to hall of fame
  $('#score-submit').on('click', () => {
    if ($.trim($('#name').val()).length === 0) {
      $('#name').parent().addClass('has-error')
    } else {
      $.post(
        '/score',
        { name: $('#name').val(), score: totalScore },
        function (data, status) {
          console.log(data)
          console.log(status)
          if (status === 'success' && data.success) {
            $('#score-submit-dialog').modal('hide')
            embrace($('#name').val(), totalScore)
            $('#name').val('')
          } else {
            embrace('', 0)
          }
        }
      )
    }
  })

  // handle showing back cards when clicked on them
  $(document)
    .mousedown(function (evt) {
      if (evt.target.tagName === 'FIGURE') {
        $(evt.target).parent().parent().addClass('popup')
      }
    })
    .mouseup(function (evt) {
      if ($('.popup')) {
        $('.popup').removeClass('popup')
      }
    })

  /**
   * Shuffle function will shuffle any array passed to it as an argument.
   * @param {array[string]} array - The array that will be shuffled.
   */
  function shuffle(array) {
    // for every element in array, counting down
    for (let i = array.length - 1; i > 0; i--) {
      // get a random index from non shuffled part of the array
      let j = Math.floor(Math.random() * (i + 1))
      // store an element at the end of the array to temporary variable
      let temp = array[i]
      // set a random picked element to the end of the array
      array[i] = array[j]
      // set the element that was at the end in place of the random element
      array[j] = temp
    }
  }

  /**
   * startGame will start the game by drawing and placing the first five cards on the table.
   */
  function startGame() {
    // starting from 0 to 5
    let counter = 0

    // set up the interval
    clearInterval(setFirstFive)
    setFirstFive = setInterval(function () {
      // loop this function 5 times
      initialDraw(counter++)

      // when done
      if (counter === 5) {
        clearInterval(setFirstFive)

        // activate drops
        $('.deck-outline').each(function () {
          showDroppable(this)
        })
        // set the next card and put it on the free spot
        drawCard()
        $('.open .card-back').css(
          'background-image',
          'url(images/cards/' + cards[activeCard++] + '.png'
        )
        setDraggable($('.open'))
        goTo($('.open'), $('#free-spot'))
      }
    }, 200)
  }

  /**
   * initialDraw will draw a card and automatically place it on a table.
   * @param {number} counter - The counter tells where to put the drawn card.
   */
  function initialDraw(counter) {
    drawCard()
    hands[counter].push(cards[activeCard - 1])
    goTo($('.open'), $('.deck-outline')[counter])
  }

  /**
   * goTo will move a target element to a destination element, and handle drag and drop events.
   * @param {element} target - Target element which will be moved.
   * @param {element} destination - Destination element where the target element is moved.
   */
  function goTo(target, destination) {
    // increase z-index to make sure the card is on top of any previous card
    zIndex += 10
    $(target).css('z-index', zIndex)

    // get the position where the target will be moved
    let position = $(destination).position()
    let topOffset = $(destination).parent().height()
    if ($(destination).attr('id') === 'free-spot') topOffset = 0

    // animate move and flip
    $(target).animate({ 'margin-left': '0' }, { duration: 300, queue: false })
    $(target).animate({ left: position.left }, { duration: 300, queue: false })
    $(target).animate(
      { top: position.top + topOffset },
      { duration: 300, queue: false }
    )
    $(target).find('.card').addClass('flipped')
    $('.open').removeClass('open')
  }

  /**
   * drawCard draws another card from the deck.
   */
  function drawCard() {
    $('.static')
      .parent()
      .append(
        '	<section class="cards open" style="margin-left: -' +
          margin +
          'px">' +
          '		<div class="card">' +
          '			<figure class="card-front"></figure>' +
          '			<figure class="card-back"></figure>' +
          '		</div>' +
          '	</section>'
      )
    $('.open .card-back').css(
      'background-image',
      'url(images/cards/' + cards[activeCard++] + '.png'
    )
  }

  /**
   * setDraggable adds dragging to target element.
   * @param {element} target - Element that should become draggable.
   */
  function setDraggable(target) {
    $(target).draggable({
      zIndex: zIndex + 10,
      revert: 'invalid',
      revertDuration: 200,
    })
  }

  /**
   * removeDraggable removes dragging to target element.
   * @param {element} target - Element that should no longer be draggable.
   */
  function removeDraggable(target) {
    $(target).draggable('destroy')
  }

  /**
   * showDroppable adds dropping to a provided element.
   * @param {element} target - Element that should become droppable.
   */
  function showDroppable(target) {
    $(target).droppable({
      activeClass: 'drop-hint',
      hoverClass: 'drop-highlight',
      disabled: false,
      drop: function (event, ui) {
        resolve(this, ui.draggable)
      },
    })
    $(target).addClass('pointer')
    $(target).click(function () {
      resolve(this, $('.ui-draggable'))
    })
  }

  /**
   * hideDroppable removes dropping to target element.
   * @param {element} target - Element that should no longer be droppable.
   */
  function hideDroppable(target) {
    $(target).droppable({ disabled: true })
    $(target).off('click')
    $(target).removeClass('pointer')
  }

  /**
   * resolve will place draggable ontop of droppable and decide whether to draw another card and increase game counters or end the game.
   * @param {element} droppable - Element that was dropped on.
   * @param {element} draggable - Element that was dragged.
   */
  function resolve(droppable, draggable) {
    // check if last card was placed and end the game
    if (round === 4 && card === 5) {
      hideDroppable(droppable)
      removeDraggable(draggable)
      hands[$(droppable).attr('tag')].push(cards[activeCard - 1])
      endGame(hands)
    } else {
      hands[$(droppable).attr('tag')].push(cards[activeCard - 1])
      drawCard()
      card++
      if (card > 5) {
        card = 1
        round++
      }
      let ele = $('.open > .card')
      setDraggable($(ele).parent())
      goTo($(ele).parent(), $('#free-spot'))
      $(ele).addClass('flipped')
      hideDroppable(droppable)
      if (card === 1) {
        $('.deck-outline').each(function () {
          showDroppable(this)
        })
      }
      $(draggable).draggable('destroy')
    }
    $(droppable).css('margin-top', '+=' + offset + 'px')
    let topOffset = $(droppable).parent().height()
    $(draggable).animate(
      {
        top: $(droppable).position().top + topOffset,
        left: $(droppable).position().left,
        'margin-left': 0,
      },
      200
    )
  }

  /**
   * endGame will stop the game and calculate score.
   * @param {array[array[string]]} hands - two dimensional array of strings that represents all user hands.
   */
  function endGame(hands) {
    let result = $('#results-div span')
    totalScore = 0

    for (let i = 0; i < hands.length; i++) {
      let hand = rankHand(hands[i])
      totalScore += hand
      $(result[i]).html(hand)
    }

    $('#score span').html(totalScore)
    if (totalScore > sessionScore) {
      sessionScore = totalScore
      $('#sessionScore').html(totalScore)
    }

    if (
      scoreboard.length < 10 ||
      totalScore > scoreboard[scoreboard.length - 1][1]
    ) {
      $('#score-submit-dialog').modal('show')
    }
  }

  /**
   * rankHand will calculate a score for a single user hand.
   * @param {array[string]} hand - Array of strings that represents single user hand.
   */
  function rankHand(hand) {
    // sort array using integer sort
    hand.sort(function (a, b) {
      return parseInt(a.substring(0, 2)) - parseInt(b.substring(0, 2))
    })

    let suits = true
    let straight = true

    // use buckets where cards with same numbers will be placed in order to calculate other combinations
    let bucket = []

    // go through all cards in a hand
    for (let i = 0; i < 5; i++) {
      // get current card number
      let currentNumber = parseInt(hand[i].substring(0, 2))

      if (i !== 4) {
        // get next card number
        let nextNumber = parseInt(hand[i + 1].substring(0, 2))

        // check suit
        if (suits && hand[i].charAt(2) !== hand[i + 1].charAt(2)) {
          suits = false
        }

        // check straight
        if (straight && currentNumber !== nextNumber - 1) {
          // handle combination with king and ace
          if (!(currentNumber === 1 && nextNumber === 10)) {
            straight = false
          }
        }
      }

      let match = false
      // go through each bucket
      for (let k = 0; k < bucket.length; k++) {
        // pick up a first card (other cards don't matter as thir number is the same) and compare its number with current hand
        if (bucket[k][0] === currentNumber) {
          // if it's the same place it in a bucket
          bucket[k].push(currentNumber)
          match = true
          break
        }
      }

      // if the of current card wasn't found in any other card in any other bucket, add new bucket and place this card inside it
      if (!match) {
        bucket.push([])
        bucket[bucket.length - 1].push(currentNumber)
      }
    }

    if (suits && straight) return 20

    if (suits || straight) return 5

    // look at the buckets to determine the score
    switch (bucket.length) {
      case 4:
        return 1
      case 3:
        if (bucket[0].length === 3 || bucket[1].length === 3) return 3
        else return 2
      case 2:
        if (bucket[0].length === 3 || bucket[1].length === 3) return 7
        else return 10
      default:
        return 0
    }
  }

  /**
   * removeCards will animate all the cards on the table back to deck.
   */
  function removeCards() {
    let destination = $('.static')[0]
    $('.cards:not(.static,#free-spot,.deck-outline)').each(function () {
      let position = $(destination).position()
      // animate move and flip
      $(this).animate({ 'margin-left': '0' }, { duration: 300, queue: false })
      $(this).animate({ left: position.left }, { duration: 300, queue: false })
      $(this).animate(
        { top: position.top },
        {
          duration: 300,
          queue: false,
          complete: function () {
            $(this).remove()
          },
        }
      )
      $(this).find('div').removeClass('flipped')
    })

    $('.deck-outline').css('margin-top', 20)
  }

  /**
   * resetGame will reset all variables of the game to the initial state.
   */
  function resetGame() {
    shuffle(cards)
    card = 1
    round = 1
    activeCard = 0
    // disable dropping
    $('.deck-outline').each(function () {
      if ($(this).hasClass('pointer')) hideDroppable(this)
    })

    hands = [[], [], [], [], []]
    $('#results-div span').html('0')
    $('#score span').html('0')
    zIndex = 100
  }

  /**
   * embrace will display cool welcome to the hall fame
   * @param {string} name - name of the player
   * @param {number} score - score of the player
   */
  function embrace(name, score) {
    if (name) {
      // show hall-wall
      $('#hall-wall').css({ visibility: 'visible', opacity: 0.9 })
      $('#hall-text').text('WELCOME')
      setTimeout(function () {
        $('#hall-text').text('TO')
      }, 1000)
      setTimeout(function () {
        $('#hall-text').text('THE')
      }, 1500)
      setTimeout(function () {
        $('#hall-text').text('HALL OF FAME')
      }, 2200)
      setTimeout(function () {
        addScore(name, score)
        $('#hall-wall').css('opacity', 0)
      }, 3200)
      setTimeout(function () {
        $('#hall-wall').css('visibility', 'hidden')
      }, 3700)
    } else {
      // show hall-wall
      $('#hall-wall').css({ visibility: 'visible', opacity: 0.9 })
      $('#hall-text').text('DENIED!')
      setTimeout(function () {
        $('#hall-wall').css('opacity', 0)
      }, 1500)
      setTimeout(function () {
        $('#hall-wall').css('visibility', 'hidden')
      }, 2000)
    }
  }

  /**
   * getScoreboard will fetch scores from the database.
   */
  function getScoreboard() {
    scoreboard = []
    $.get('score', function (response, status) {
      if (status === 'success') {
        // var response = JSON.parse(data);
        for (let i = 0; i < response.length; i++) {
          scoreboard.push([response[i].name, response[i].score])
        }
        updateHiScore()
      }
    })
  }

  /**
   * updateHiScore will fill the hi score table with values provided.
   */
  function updateHiScore() {
    for (let i = 0; i < scoreboard.length; i++) {
      if (scoreboard[i] !== undefined) {
        let tableRow = $('#scoreboard tr').eq(i + 2)
        $(tableRow).html(
          '<td>' +
            (i + 1) +
            '.</td><td>' +
            scoreboard[i][0] +
            '</td><td>' +
            scoreboard[i][1] +
            '</td>'
        )
      }
    }
  }

  /**
   * addScore will add score to scoreboard and remove excess item if necessary.
   */
  function addScore(name, score) {
    let flag = true
    for (let i = 0; i < scoreboard.length; i++) {
      if (scoreboard[i][1] < score) {
        flag = false
        scoreboard.splice(i, 0, [name, score])
        if (scoreboard.length > 10) scoreboard.splice(scoreboard.length - 1, 1)
        break
      }
    }
    if (flag) {
      scoreboard.push([name, score])
    }
    updateHiScore()
  }

  /*
	$(window).resize(function(){
		var left = $(".deck-outline").offset().left;
		var top = $(".deck-outline").offset().top;
		var tempLeft = $(".card.flipped").eq(0).offset().left;
		var tempTop = $(".card.flipped").eq(0).offset().top;
		var goLeft = left - tempLeft;
		var goTop = top - tempTop;
		$(".card.flipped").parent().css("left", "+=" + goLeft + "px");
		$(".card.flipped").parent().css("top", "+=" + goTop + "px");
	});*/
})

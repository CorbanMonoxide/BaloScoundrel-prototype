import random
import itertools

def build_deck():
    deck = []
    for v in range(2, 15):
        deck.append({'suit': 'Spades', 'val': v, 'type': 'monster'})
        deck.append({'suit': 'Clubs', 'val': v, 'type': 'monster'})
        if v <= 10:
            deck.append({'suit': 'Diamonds', 'val': v, 'type': 'weapon'})
            deck.append({'suit': 'Hearts', 'val': v, 'type': 'potion'})
    random.shuffle(deck)
    return deck

def sim_play(state, card):
    hp, score, w_val, w_lim, w_mult, potion_used = state
    if card['type'] == 'potion':
        if potion_used: return None
        hp = min(20, hp + card['val'])
        potion_used = True
    elif card['type'] == 'weapon':
        w_val = card['val']
        w_lim = 15
        w_mult = card['val']
    elif card['type'] == 'monster':
        mult = 1
        if w_val is not None and card['val'] <= w_lim:
            mult = w_mult
            dmg = max(0, card['val'] - w_val)
            hp -= dmg
            w_lim = card['val']
            w_mult = card['val']
        else:
            hp -= card['val']
            mult = 1
        score += (card['val'] * 10) * mult
    if hp <= 0: return None
    return (hp, score, w_val, w_lim, w_mult, potion_used)

runs = 10000
wins = 0
avg_score_losses = 0

for _ in range(runs):
    deck = build_deck()
    state = (20, 0, None, None, 1, False)
    room = []
    fled_last = False

    while True:
        hp, score, w_val, w_lim, w_mult, _ = state
        if score >= 8000:
            wins += 1
            break
        if hp <= 0:
            avg_score_losses += score
            break
        if not deck and not room:
            avg_score_losses += score
            break
        
        while len(room) < 4 and deck:
            room.append(deck.pop())
        
        cards_to_play = min(3, len(room))
        best_state = None
        best_score = -1
        best_indices = []

        for p in itertools.permutations(range(len(room)), cards_to_play):
            curr = (hp, score, w_val, w_lim, w_mult, False)
            valid = True
            for idx in p:
                curr = sim_play(curr, room[idx])
                if not curr:
                    valid = False
                    break
            if valid:
                h = curr[1] * 100 + curr[0] * 10 + (curr[2] if curr[2] else 0)
                if h > best_score:
                    best_score = h
                    best_state = curr
                    best_indices = p
        
        if not best_state:
            if not fled_last:
                deck = room + deck
                room = []
                fled_last = True
            else:
                avg_score_losses += score
                break
        else:
            state = best_state
            new_room = [room[i] for i in range(len(room)) if i not in best_indices]
            room = new_room
            fled_last = False

losses = runs - wins
avg_loss = avg_score_losses / losses if losses > 0 else 0
print(f"Wins: {wins} / {runs} ({wins/runs*100:.2f}%)")
print(f"Avg score on loss: {avg_loss:.0f}")

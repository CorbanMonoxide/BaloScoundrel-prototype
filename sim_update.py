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
    # State: (hp, score, gold, w_val, w_lim, w_mult, potion_used)
    hp, score, gold, w_val, w_lim, w_mult, potion_used = state
    
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
        
        # Gold logic
        earned_gold = 1 if card['val'] <= 10 else (card['val'] - 9)
        gold += earned_gold

    if hp <= 0: return None
    return (hp, score, gold, w_val, w_lim, w_mult, potion_used)

def run_simulation(runs=1000):
    wins = 0
    total_gold_on_win = 0

    for _ in range(runs):
        deck = build_deck()
        state = (20, 0, 0, None, None, 1, False)
        room = []
        fled_last = False

        while True:
            hp, score, gold, w_val, w_lim, w_mult, _ = state
            
            # Chamber target
            if score >= 3000:
                wins += 1
                total_gold_on_win += gold
                break
                
            if hp <= 0:
                break
                
            if not deck and not room:
                break
            
            while len(room) < 4 and deck:
                room.append(deck.pop())
                
            if not room:
                break
            
            # Play up to 3 cards
            cards_to_play = min(3, len(room))
            best_state = None
            best_score_heuristic = -1
            best_indices = []

            # Dumb greedy AI: checks all permutations of 3 cards in the room
            for p in itertools.permutations(range(len(room)), cards_to_play):
                curr = (hp, score, gold, w_val, w_lim, w_mult, False)
                valid = True
                for idx in p:
                    res = sim_play(curr, room[idx])
                    if res is None:
                        valid = False
                        break
                    curr = res
                
                if valid:
                    # Heuristic to pick best play: Maximize score + value health + hold weapons
                    # Since we want to reach 3000, prioritize score
                    c_hp, c_score, c_gold, c_w_val, c_w_lim, c_w_mult, _ = curr
                    h = c_score * 100 + c_hp * 50 + (c_w_mult * 10 if c_w_val else 0)
                    if h > best_score_heuristic:
                        best_score_heuristic = h
                        best_state = curr
                        best_indices = p
            
            if not best_state:
                if not fled_last:
                    # Flee
                    for c in room:
                        deck.insert(0, c)
                    room = []
                    fled_last = True
                else:
                    break # Dead end
            else:
                state = best_state
                # Keep the unplayed card(s)
                room = [room[i] for i in range(len(room)) if i not in best_indices]
                fled_last = False

    avg_gold = total_gold_on_win / wins if wins > 0 else 0
    print(f"Target Score: 3000")
    print(f"Wins: {wins} / {runs} ({wins/runs*100:.2f}%)")
    print(f"Average Gold at 3000 pts: {avg_gold:.2f} Gold")

run_simulation(2000)

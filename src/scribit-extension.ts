import { createMediaPlayerInstances } from '@scribit/shared/utils';
import { PlayerFactory } from './classes/player-factory';
import { Storage } from '@scribit/feature/browser-extension';

const factory = PlayerFactory.getInstance();
const userPreferences = Storage.get(Storage.Key.UserPreference)
const onReady = new Promise<Document>(resolve => {
    const readyStateInterval = setInterval(function() {
        if (document.readyState === 'complete') {
            clearInterval(readyStateInterval);
            resolve(document);
        }
    }, 10);
});

Promise.all([onReady, userPreferences]).then(([document, preferences]) => {
    scan();

    console.log(document, preferences);
});

function scan(): void {
    const players = createMediaPlayerInstances(factory);

    console.log('players:', players);
}

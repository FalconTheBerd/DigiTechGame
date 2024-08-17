```
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    let vulgarian = localStorage.getItem('vulgarian');
    console.log('Vulgarian:', vulgarian);

    const ability1 = document.getElementById('ability1');
    console.log('Ability 1 Element:', ability1);

    ability1.addEventListener('touchstart', function () {
        console.log('Touchstart event triggered for Ability 1');
        if (vulgarian === 'Ember') {
            useAbility('flameBarrage');
            console.log('Used Flame Barrage');
        } else if (vulgarian === 'Frostbite') {
            useAbility('iceBlast');
            console.log('Used Ice Blast');
        } else {
            console.log('Character not found in localStorage.');
        }
    });

    ability1.addEventListener('click', function () {
        console.log('Click event triggered for Ability 1');
        if (vulgarian === 'Ember') {
            useAbility('flameBarrage');
            console.log('Used Flame Barrage');
        } else if (vulgarian === 'Frostbite') {
            useAbility('iceBlast');
            console.log('Used Ice Blast');
        } else {
            console.log('Character not found in localStorage.');
        }
    });

    // Similar listeners for other abilities...
});
```
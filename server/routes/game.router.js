const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');


//  get a specific game from game DB
router.get('/', rejectUnauthenticated, (req, res) => {
    // GET route code here
    const query = `SELECT * FROM "game" WHERE "user_id"=$1;`
    pool.query(query, [req.user.id]).then(result => {
        res.send(result.rows);
    })
        .catch(err => {
            console.log("error getting games", err);
            res.sendStatus(500)
        })
});


// POST to add a newGame.  --> im going to want to do a third query to make sure tile_pos.0 is cross and tile_pos.24 is end.
router.post('/', (req, res) => {
    console.log(req.body);
    // RETURNING "id" will give us back the id of the created game
    const newGameQuery = `
  INSERT INTO "game" ("name", "total_tiles", "user_id")
  VALUES ($1, $2, $3)
  RETURNING "id";`
    // above sets 2 values for a new game, others are default, still need to assign tiles.
    pool.query(newGameQuery, [req.body.name, 49, req.user.id])
        .then(async result => {
            console.log('New Game Id:', result.rows[0].id); 
            const createdGameId = result.rows[0].id  //in the new result on the new row gets the id.
            const insertTileGenQuery = `
      INSERT INTO "game_tiles" ("game_id", "shape_url", "tile_orientation", "tile_pos")
      VALUES  ($1, $2, $3, $4);
      `
            var i = 0;
            while (i < 49) { // need to change for different grid sizes.
                const shapeResult = await pool.query('SELECT * FROM "tiledex" ORDER BY RANDOM() LIMIT 1');
                console.log(shapeResult.rows[0]);
                const tile = shapeResult.rows[0];
                const orientation = Math.floor((Math.random() * 4) + 1);
                switch (orientation) {
                    case 1:
                        orientationVal = 'zero';
                        break;
                    case 2:
                        orientationVal = 'ninety';
                        break;
                    case 3:
                        orientationVal = 'oneEight';
                        break;
                    case 4:
                        orientationVal = 'twoSeven';
                        break;
                    default:
                        break;
                }
                pool.query(insertTileGenQuery, [createdGameId, tile.shape, orientationVal, i]);
                i++;
            };
            res.sendStatus(201);
        }).catch(err => {
            console.log(err);
            res.sendStatus(500)
        })
});


router.delete(`/:id`, (req, res) => {
    console.log(req.params.id);
    const gameOver = req.params.id;
    const query = `DELETE FROM "game" WHERE "id"=$1;`
    pool.query(query, [gameOver])
        .then(async result => {
            const gameTilesQuery = `DELETE FROM "game_tiles" WHERE "game_id"=$1;`
            pool.query(gameTilesQuery, [gameOver]);
        })
        .catch(err => {
            console.log("error getting games", err);
            res.sendStatus(500)
        })
});


// GET the game_tiles tiles array
router.get(`/:id`, (req, res) => {
    const gameOn = req.params.id;
    const gameTilesQuery = `SELECT * FROM "game_tiles" WHERE "game_id"=$1 ORDER BY "tile_pos" ASC;`
    pool.query(gameTilesQuery, [gameOn])
        .then(result => {
            res.send(result.rows);
        }).catch(err => {
            console.log('Could not load game_tiles')
        });
});


// UPDATE the tile_pos in game_tiles DB
router.put(`/:id`, async (req, res) => {
    const mazeToUpdate = req.params.id;
    const update = req.body.payload;
    console.log('update router, game & update', mazeToUpdate, update);
    try {
        for (let i = 0; i < update.length; i++) {
        const queryText = `UPDATE "game_tiles" SET "tile_pos" = $1, "tile_orientation"= $2
                    WHERE "id" = $3 AND "game_id" = $4;`;
        await pool.query(queryText, [update[i].tile_pos, update[i].tile_orientation, update[i].id, mazeToUpdate])
    };
    res.sendStatus(201);
} // end try
catch ( err ) {
    console.log(err);
    res.sendStatus(500)
}
}); 


module.exports = router;
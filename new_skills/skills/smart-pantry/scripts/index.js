window['ai_edge_gallery_get_result'] = async (data) => {
  try {
    const input = JSON.parse(data);
    const action = (input.action || 'list').toLowerCase();
    let state = input.game_state
      ? (typeof input.game_state === 'string' ? JSON.parse(input.game_state) : input.game_state)
      : null;

    if (!state) {
      state = { pantry: [] };
    }

    // Compact recipe builder
    function r(name, ingredients, servings, time, category, instructions) {
      return { name, ingredients, servings, time, category, instructions };
    }

    const RECIPES = [
      // ========== QUICK & EASY (25) ==========
      r("Grilled Cheese", ["bread","cheese","butter"], 1, "10 min", "quick", "Butter bread. Place cheese between. Grill until golden on both sides."),
      r("Avocado Toast", ["bread","avocado","lemon","salt","red pepper flakes"], 1, "5 min", "quick", "Toast bread. Mash avocado with lemon and salt. Spread on toast. Sprinkle red pepper flakes."),
      r("PB Banana Toast", ["bread","peanut butter","banana","honey"], 1, "5 min", "quick", "Toast bread. Spread peanut butter. Top with sliced banana and drizzle honey."),
      r("Caprese Salad", ["tomato","mozzarella","basil","olive oil","balsamic vinegar"], 2, "5 min", "quick", "Slice tomato and mozzarella. Alternate on plate with basil. Drizzle olive oil and balsamic."),
      r("Bruschetta", ["bread","tomato","garlic","basil","olive oil","balsamic vinegar"], 2, "10 min", "quick", "Toast bread. Dice tomato with garlic, basil, olive oil. Spoon onto toast. Drizzle balsamic."),
      r("Hummus Veggie Wrap", ["tortilla","hummus","cucumber","bell pepper","spinach","feta"], 1, "5 min", "quick", "Spread hummus on tortilla. Layer spinach, cucumber, bell pepper, feta. Roll tightly."),
      r("BLT Sandwich", ["bread","bacon","lettuce","tomato","mayonnaise"], 1, "10 min", "quick", "Cook bacon until crispy. Toast bread. Layer mayo, lettuce, tomato, bacon."),
      r("Egg Salad Sandwich", ["egg","mayonnaise","mustard","bread","salt","pepper"], 2, "15 min", "quick", "Hard boil eggs. Mash with mayo, mustard, salt, pepper. Serve on bread."),
      r("Tuna Salad", ["tuna","mayonnaise","celery","onion","lemon","salt","pepper"], 2, "10 min", "quick", "Drain tuna. Mix with mayo, diced celery, onion, lemon juice, salt, pepper."),
      r("Greek Yogurt Bowl", ["yogurt","granola","honey","blueberry","banana"], 1, "5 min", "quick", "Spoon yogurt into bowl. Top with granola, banana, blueberries, honey."),
      r("Turkey Club", ["bread","turkey","bacon","lettuce","tomato","mayonnaise","cheese"], 1, "10 min", "quick", "Toast bread. Layer mayo, turkey, bacon, cheese, lettuce, tomato between 3 slices."),
      r("Prosciutto Melon", ["prosciutto","cantaloupe","basil","olive oil","pepper"], 2, "5 min", "quick", "Wrap prosciutto around melon slices. Garnish with basil, olive oil, pepper."),
      r("Cheese Quesadilla", ["tortilla","cheese","salsa","sour cream"], 1, "5 min", "quick", "Fill tortilla with cheese. Cook in pan until crispy. Serve with salsa and sour cream."),
      r("Cottage Cheese Bowl", ["cottage cheese","tomato","cucumber","olive oil","salt","pepper","everything bagel seasoning"], 1, "5 min", "quick", "Scoop cottage cheese. Top with diced tomato, cucumber, olive oil, seasoning."),
      r("Antipasto Plate", ["salami","mozzarella","olive","roasted pepper","artichoke","bread"], 2, "5 min", "quick", "Arrange salami, mozzarella, olives, peppers, artichokes on plate. Serve with bread."),
      r("Smoked Salmon Bagel", ["bagel","cream cheese","smoked salmon","capers","red onion","lemon"], 1, "5 min", "quick", "Toast bagel. Spread cream cheese. Layer salmon, capers, red onion. Squeeze lemon."),
      r("Stuffed Dates", ["dates","almond","cream cheese","honey"], 4, "10 min", "quick", "Slit dates. Fill with cream cheese and almond. Drizzle honey."),
      r("Tomato Mozzarella Panini", ["bread","mozzarella","tomato","basil","pesto","butter"], 1, "10 min", "quick", "Spread pesto on bread. Layer mozzarella, tomato, basil. Grill in butter until golden."),
      r("Ham and Cheese Roll-ups", ["ham","cheese","mustard","pickle"], 2, "5 min", "quick", "Spread mustard on ham. Place cheese and pickle. Roll up. Slice into pieces."),
      r("Pimento Cheese Sandwich", ["bread","cheddar","cream cheese","pimento","mayonnaise","paprika"], 2, "10 min", "quick", "Mix cheddar, cream cheese, pimento, mayo, paprika. Spread on bread."),
      r("Ants on a Log", ["celery","peanut butter","raisin"], 2, "5 min", "quick", "Fill celery sticks with peanut butter. Top with raisins."),
      r("Ricotta Toast", ["bread","ricotta","honey","pistachio","lemon zest"], 1, "5 min", "quick", "Toast bread. Spread ricotta. Drizzle honey. Top with pistachios and lemon zest."),
      r("Cucumber Bites", ["cucumber","cream cheese","smoked salmon","dill"], 4, "10 min", "quick", "Slice cucumber thick. Top with cream cheese, smoked salmon, dill."),
      r("Tuna Melt", ["bread","tuna","mayonnaise","cheese","onion","butter"], 1, "10 min", "quick", "Mix tuna, mayo, onion. Place on bread, top with cheese. Broil until melted."),
      r("Veggie Cream Cheese Wrap", ["tortilla","cream cheese","carrot","cucumber","bell pepper","sprouts"], 1, "5 min", "quick", "Spread cream cheese on tortilla. Add shredded carrot, cucumber, pepper, sprouts. Roll."),

      // ========== BREAKFAST (30) ==========
      r("Basic Omelet", ["egg","butter","salt","pepper","cheese"], 1, "10 min", "breakfast", "Whisk eggs with salt and pepper. Cook in buttered pan. Add cheese, fold, serve."),
      r("Pancakes", ["flour","egg","milk","butter","sugar","baking powder"], 4, "20 min", "breakfast", "Mix dry ingredients. Whisk in egg, milk, melted butter. Cook on griddle until bubbly. Flip."),
      r("French Toast", ["bread","egg","milk","cinnamon","vanilla","butter","maple syrup"], 2, "15 min", "breakfast", "Whisk eggs, milk, cinnamon, vanilla. Dip bread. Cook in butter until golden. Serve with syrup."),
      r("Shakshuka", ["egg","tomato","onion","garlic","bell pepper","cumin","paprika","olive oil"], 2, "25 min", "breakfast", "Saute onion, pepper, garlic. Add tomatoes, spices. Simmer. Crack eggs in. Cover until set."),
      r("Breakfast Burrito", ["tortilla","egg","cheese","bacon","salsa","avocado"], 1, "15 min", "breakfast", "Scramble eggs with cheese. Cook bacon. Fill tortilla with eggs, bacon, salsa, avocado."),
      r("Overnight Oats", ["oats","milk","yogurt","honey","chia seeds","banana"], 1, "5 min", "breakfast", "Mix oats, milk, yogurt, honey, chia seeds. Refrigerate overnight. Top with banana."),
      r("Waffles", ["flour","egg","milk","butter","sugar","baking powder","vanilla"], 4, "20 min", "breakfast", "Mix dry ingredients. Add egg, milk, butter, vanilla. Cook in waffle iron until golden."),
      r("Eggs Benedict", ["egg","english muffin","ham","butter","lemon","hollandaise"], 2, "25 min", "breakfast", "Poach eggs. Toast muffins. Layer ham, poached egg. Top with hollandaise."),
      r("Acai Bowl", ["acai","banana","blueberry","granola","honey","coconut"], 1, "10 min", "breakfast", "Blend acai with banana and blueberries. Pour into bowl. Top with granola, coconut, honey."),
      r("Banana Smoothie", ["banana","milk","yogurt","honey","ice"], 1, "5 min", "breakfast", "Blend banana, milk, yogurt, honey, ice until smooth."),
      r("Berry Smoothie Bowl", ["strawberry","blueberry","banana","yogurt","granola","honey"], 1, "10 min", "breakfast", "Blend berries, banana, yogurt until thick. Pour into bowl. Top with granola and honey."),
      r("Huevos Rancheros", ["tortilla","egg","black beans","salsa","cheese","avocado","cilantro"], 2, "15 min", "breakfast", "Fry tortillas. Top with beans, fried eggs, salsa, cheese, avocado, cilantro."),
      r("Croque Madame", ["bread","ham","gruyere","butter","egg","bechamel"], 1, "15 min", "breakfast", "Layer ham and gruyere on bread. Spread bechamel. Bake. Top with fried egg."),
      r("Breakfast Hash", ["potato","bell pepper","onion","bacon","egg","cheese","paprika"], 2, "25 min", "breakfast", "Dice and fry potatoes, peppers, onion, bacon. Season with paprika. Top with fried eggs and cheese."),
      r("Granola", ["oats","honey","coconut oil","almond","walnut","vanilla","cinnamon"], 8, "30 min", "breakfast", "Mix oats, nuts, coconut oil, honey, vanilla, cinnamon. Bake 325F for 20 min, stirring halfway."),
      r("Crepes", ["flour","egg","milk","butter","sugar","vanilla"], 4, "20 min", "breakfast", "Whisk flour, eggs, milk, sugar, vanilla, melted butter. Pour thin on hot pan. Cook 1 min per side. Fill."),
      r("Eggs Florentine", ["egg","english muffin","spinach","hollandaise","butter","lemon"], 2, "20 min", "breakfast", "Saute spinach. Poach eggs. Toast muffins. Layer spinach, egg, hollandaise."),
      r("Steel Cut Oatmeal", ["steel cut oats","milk","brown sugar","cinnamon","apple","walnut"], 2, "25 min", "breakfast", "Simmer oats in milk 20 min. Top with brown sugar, cinnamon, diced apple, walnuts."),
      r("Chilaquiles", ["tortilla chips","salsa","egg","cheese","sour cream","avocado","cilantro","onion"], 2, "15 min", "breakfast", "Simmer chips in salsa. Top with fried eggs, cheese, sour cream, avocado, cilantro."),
      r("Corned Beef Hash", ["corned beef","potato","onion","bell pepper","egg","butter","paprika"], 2, "25 min", "breakfast", "Dice and fry potato, onion, pepper. Add diced corned beef. Season. Top with fried eggs."),
      r("Bagel with Lox", ["bagel","cream cheese","smoked salmon","capers","red onion","tomato","dill"], 1, "5 min", "breakfast", "Toast bagel. Spread cream cheese. Layer salmon, capers, onion, tomato, dill."),
      r("Breakfast Sandwich", ["english muffin","egg","cheese","bacon","butter"], 1, "10 min", "breakfast", "Toast muffin. Cook bacon and egg. Layer cheese, bacon, egg on muffin."),
      r("Dutch Baby", ["flour","egg","milk","butter","sugar","lemon","powdered sugar"], 2, "25 min", "breakfast", "Blend eggs, milk, flour, sugar. Pour into hot buttered skillet. Bake 425F 20 min. Top with lemon, powdered sugar."),
      r("Banana Bread", ["banana","flour","sugar","egg","butter","baking soda","vanilla","cinnamon"], 8, "60 min", "breakfast", "Mash bananas. Mix with sugar, butter, egg, vanilla. Fold in flour, baking soda, cinnamon. Bake 350F 50 min."),
      r("Muesli", ["oats","milk","yogurt","apple","raisin","almond","honey"], 1, "5 min", "breakfast", "Mix oats with milk and yogurt. Add diced apple, raisins, almonds. Drizzle honey."),
      r("Egg in a Hole", ["bread","egg","butter","salt","pepper"], 1, "5 min", "breakfast", "Cut hole in bread. Butter pan. Place bread, crack egg in hole. Cook until set. Flip."),
      r("Savory Oatmeal", ["oats","egg","cheese","green onion","soy sauce","sesame oil","chili flakes"], 1, "10 min", "breakfast", "Cook oats. Top with fried egg, cheese, green onion, soy sauce, sesame oil, chili flakes."),
      r("Migas", ["tortilla","egg","tomato","onion","jalapeno","cheese","cilantro","oil"], 2, "15 min", "breakfast", "Fry tortilla strips. Scramble eggs with tomato, onion, jalapeno. Mix in chips. Top with cheese, cilantro."),
      r("Scones", ["flour","butter","sugar","cream","egg","baking powder","vanilla","blueberry"], 8, "30 min", "breakfast", "Cut butter into flour, sugar, baking powder. Add cream, egg, vanilla, blueberries. Form rounds. Bake 400F 18 min."),
      r("Biscuits and Gravy", ["flour","butter","baking powder","milk","sausage","salt","pepper"], 4, "25 min", "breakfast", "Make biscuits: flour, butter, baking powder, milk. Bake. Brown sausage, add flour and milk for gravy."),

      // ========== PASTA & NOODLES (35) ==========
      r("Pasta Aglio e Olio", ["pasta","garlic","olive oil","red pepper flakes","parsley"], 2, "15 min", "pasta", "Cook pasta. Saute garlic in olive oil. Toss with pasta, red pepper flakes, parsley."),
      r("Spaghetti Meat Sauce", ["spaghetti","ground beef","tomato sauce","onion","garlic","oregano","basil"], 4, "30 min", "pasta", "Brown beef with onion, garlic. Add sauce, oregano, basil. Simmer. Serve over spaghetti."),
      r("Carbonara", ["spaghetti","bacon","egg","parmesan","pepper","garlic"], 2, "20 min", "pasta", "Cook pasta. Fry bacon. Whisk eggs with parmesan. Toss hot pasta with bacon, then egg mixture off heat."),
      r("Pesto Pasta", ["pasta","basil","pine nuts","garlic","parmesan","olive oil"], 2, "15 min", "pasta", "Blend basil, pine nuts, garlic, parmesan, olive oil. Cook pasta. Toss with pesto."),
      r("Mac and Cheese", ["macaroni","cheese","milk","butter","flour","mustard"], 4, "25 min", "pasta", "Cook macaroni. Make roux with butter, flour. Add milk, cheese, mustard. Combine with pasta."),
      r("Pad Thai", ["rice noodles","shrimp","egg","peanuts","lime","soy sauce","brown sugar","garlic"], 2, "25 min", "pasta", "Soak noodles. Stir-fry shrimp, garlic. Add egg, noodles, sauce. Top with peanuts."),
      r("Ramen Upgrade", ["ramen","egg","green onion","soy sauce","sesame oil","sriracha"], 1, "10 min", "pasta", "Cook ramen. Add soft-boiled egg, green onion, soy sauce, sesame oil, sriracha."),
      r("Lo Mein", ["noodles","chicken","bell pepper","carrot","soy sauce","sesame oil","garlic","ginger"], 2, "20 min", "pasta", "Cook noodles. Stir-fry chicken, veggies with garlic, ginger. Add noodles, soy sauce."),
      r("Penne Arrabbiata", ["penne","tomato sauce","garlic","red pepper flakes","olive oil","basil","parmesan"], 2, "20 min", "pasta", "Saute garlic and chili in oil. Add sauce. Cook penne. Toss. Top with basil, parmesan."),
      r("Lasagna", ["lasagna noodles","ground beef","tomato sauce","ricotta","mozzarella","parmesan","onion","garlic"], 6, "60 min", "pasta", "Brown beef with onion, garlic, sauce. Layer noodles, meat, ricotta, mozzarella. Bake 375F 40 min."),
      r("Alfredo Pasta", ["fettuccine","butter","cream","parmesan","garlic","pepper"], 2, "20 min", "pasta", "Cook fettuccine. Melt butter with garlic, add cream. Stir in parmesan. Toss with pasta."),
      r("Shrimp Scampi", ["spaghetti","shrimp","garlic","butter","white wine","lemon","parsley","red pepper flakes"], 2, "20 min", "pasta", "Cook spaghetti. Saute garlic in butter, add shrimp, wine, lemon. Toss with pasta and parsley."),
      r("Bolognese", ["spaghetti","ground beef","ground pork","tomato sauce","onion","carrot","celery","red wine"], 4, "90 min", "pasta", "Saute onion, carrot, celery. Brown meats. Add wine, reduce. Add sauce. Simmer 1 hour."),
      r("Cacio e Pepe", ["spaghetti","pecorino","black pepper","butter"], 2, "15 min", "pasta", "Cook pasta. Toss with butter, pecorino, lots of black pepper. Use pasta water for creamy sauce."),
      r("Puttanesca", ["spaghetti","tomato","olive","capers","anchovy","garlic","red pepper flakes","olive oil"], 2, "20 min", "pasta", "Saute garlic, anchovy. Add tomatoes, olives, capers, chili. Simmer. Toss with spaghetti."),
      r("Baked Ziti", ["ziti","ricotta","mozzarella","parmesan","tomato sauce","Italian sausage","garlic","basil"], 6, "45 min", "pasta", "Cook ziti. Brown sausage. Layer pasta, ricotta, sauce, mozzarella. Bake 375F 25 min."),
      r("Vodka Sauce Pasta", ["penne","tomato sauce","vodka","cream","onion","garlic","red pepper flakes","parmesan"], 4, "25 min", "pasta", "Saute onion, garlic. Add sauce. Add vodka, reduce. Stir in cream. Toss with penne, parmesan."),
      r("Orzo Salad", ["orzo","cucumber","tomato","feta","olive","red onion","lemon","olive oil"], 4, "15 min", "pasta", "Cook orzo. Chill. Toss with diced veggies, feta, olives, lemon, olive oil."),
      r("Gnocchi with Brown Butter", ["gnocchi","butter","sage","parmesan","pine nuts"], 2, "15 min", "pasta", "Cook gnocchi. Brown butter with sage. Toss gnocchi in brown butter. Top with parmesan, pine nuts."),
      r("Mushroom Pasta", ["pasta","mushroom","garlic","butter","cream","thyme","parmesan"], 2, "20 min", "pasta", "Saute mushrooms in butter. Add garlic, thyme, cream. Cook pasta. Toss together with parmesan."),
      r("Sausage Rigatoni", ["rigatoni","Italian sausage","tomato sauce","onion","garlic","cream","spinach","parmesan"], 4, "25 min", "pasta", "Brown sausage. Saute onion, garlic. Add sauce and cream. Add spinach. Toss with rigatoni."),
      r("Lemon Garlic Pasta", ["pasta","lemon","garlic","olive oil","parmesan","parsley","red pepper flakes"], 2, "15 min", "pasta", "Cook pasta. Saute garlic in oil. Add lemon juice, zest. Toss with pasta, parmesan, parsley."),
      r("Cold Sesame Noodles", ["noodles","peanut butter","soy sauce","sesame oil","rice vinegar","garlic","chili","cucumber"], 2, "15 min", "pasta", "Cook noodles. Chill. Whisk peanut butter, soy, sesame oil, vinegar, garlic, chili. Toss. Top with cucumber."),
      r("Japchae", ["sweet potato noodles","beef","spinach","carrot","mushroom","soy sauce","sesame oil","sugar"], 2, "25 min", "pasta", "Cook noodles. Stir-fry beef, veggies separately. Toss all with soy sauce, sesame oil, sugar."),
      r("Dan Dan Noodles", ["noodles","ground pork","soy sauce","sesame paste","chili oil","garlic","green onion","sichuan pepper"], 2, "15 min", "pasta", "Cook noodles. Fry pork with garlic. Make sauce: sesame paste, soy, chili oil. Toss noodles in sauce, top with pork."),
      r("Pho", ["rice noodles","beef broth","beef","star anise","cinnamon","fish sauce","bean sprouts","basil","lime"], 2, "30 min", "pasta", "Simmer broth with star anise, cinnamon, fish sauce. Cook noodles. Slice beef thin. Assemble. Serve with sprouts, basil, lime."),
      r("Udon Stir-fry", ["udon","chicken","cabbage","carrot","soy sauce","mirin","sesame oil","ginger"], 2, "15 min", "pasta", "Cook udon. Stir-fry chicken, cabbage, carrot with ginger. Add udon, soy sauce, mirin, sesame oil."),
      r("Pasta Primavera", ["pasta","zucchini","bell pepper","tomato","onion","garlic","olive oil","parmesan","basil"], 2, "20 min", "pasta", "Saute all vegetables in olive oil with garlic. Cook pasta. Toss together. Top with parmesan, basil."),
      r("Creamy Tuscan Pasta", ["pasta","chicken","sun-dried tomato","spinach","cream","garlic","parmesan","basil"], 2, "25 min", "pasta", "Cook chicken. Add garlic, sun-dried tomatoes, spinach, cream. Simmer. Toss with pasta and parmesan."),
      r("Singapore Noodles", ["rice vermicelli","shrimp","pork","egg","curry powder","bell pepper","green onion","soy sauce"], 2, "20 min", "pasta", "Cook vermicelli. Stir-fry shrimp, pork. Add egg, veggies, curry powder. Toss with noodles, soy sauce."),
      r("Linguine with Clams", ["linguine","clam","garlic","white wine","butter","parsley","red pepper flakes","lemon"], 2, "20 min", "pasta", "Cook linguine. Saute garlic in butter. Add clams, wine. Cover until open. Toss with pasta, parsley, lemon."),
      r("Stuffed Shells", ["jumbo shells","ricotta","mozzarella","parmesan","spinach","egg","tomato sauce","garlic"], 4, "45 min", "pasta", "Cook shells. Mix ricotta, mozzarella, spinach, egg. Stuff shells. Cover with sauce. Bake 375F 25 min."),
      r("Chicken Pesto Pasta", ["pasta","chicken","pesto","sun-dried tomato","parmesan","pine nuts","olive oil"], 2, "20 min", "pasta", "Cook pasta. Grill chicken. Toss pasta with pesto, diced chicken, sun-dried tomatoes. Top with parmesan, pine nuts."),
      r("Tteokbokki", ["rice cakes","gochujang","gochugaru","soy sauce","sugar","fish cake","green onion","egg"], 2, "20 min", "pasta", "Simmer rice cakes in sauce of gochujang, gochugaru, soy, sugar. Add fish cake. Top with egg, green onion."),
      r("Yakisoba", ["yakisoba noodles","pork","cabbage","carrot","onion","yakisoba sauce","ginger","nori"], 2, "15 min", "pasta", "Stir-fry pork, vegetables with ginger. Add noodles and sauce. Toss. Top with nori."),

      // ========== RICE & GRAINS (30) ==========
      r("Chicken Fried Rice", ["chicken","rice","egg","soy sauce","garlic","green onion","oil"], 4, "25 min", "rice", "Cook rice. Stir-fry diced chicken. Scramble egg. Combine with soy sauce, garlic. Top with green onion."),
      r("Egg Fried Rice", ["rice","egg","soy sauce","green onion","oil","garlic"], 2, "15 min", "rice", "Scramble eggs. Stir-fry rice with garlic, soy sauce. Mix in egg, green onion."),
      r("Bean Rice Bowl", ["rice","black beans","salsa","cheese","sour cream","lime"], 2, "15 min", "rice", "Cook rice. Heat beans. Top rice with beans, salsa, cheese, sour cream, lime."),
      r("Bibimbap", ["rice","ground beef","spinach","carrot","egg","gochujang","sesame oil","soy sauce"], 2, "30 min", "rice", "Cook rice. Saute beef. Blanch spinach, julienne carrot. Top rice with toppings, fried egg, gochujang."),
      r("Chicken Teriyaki Bowl", ["chicken","rice","soy sauce","honey","garlic","ginger","broccoli","sesame seeds"], 2, "25 min", "rice", "Grill chicken, glaze with teriyaki sauce. Serve over rice with broccoli. Top with sesame seeds."),
      r("Burrito Bowl", ["rice","chicken","black beans","corn","salsa","avocado","lime","cheese"], 2, "25 min", "rice", "Cook rice with lime. Cook chicken. Layer rice, beans, corn, chicken, salsa, avocado, cheese."),
      r("Coconut Curry Rice", ["rice","coconut milk","curry paste","chicken","bell pepper","basil","fish sauce","sugar"], 2, "25 min", "rice", "Fry curry paste. Add coconut milk, chicken, pepper. Simmer. Serve over rice with basil."),
      r("Risotto", ["arborio rice","onion","white wine","chicken broth","parmesan","butter","garlic"], 2, "35 min", "rice", "Saute onion, garlic. Toast rice. Add wine. Slowly add broth, stirring. Finish with butter, parmesan."),
      r("Spam Fried Rice", ["rice","spam","egg","soy sauce","green onion","garlic","sesame oil"], 2, "15 min", "rice", "Dice and fry spam. Scramble egg. Stir-fry rice with garlic, soy sauce. Mix in spam, egg, green onion."),
      r("Mediterranean Quinoa Bowl", ["quinoa","cucumber","tomato","feta","olive","red onion","olive oil","lemon"], 2, "20 min", "rice", "Cook quinoa. Chop veggies. Toss with olive oil, lemon. Top with feta, olives."),
      r("Poke Bowl", ["rice","tuna","soy sauce","sesame oil","avocado","cucumber","edamame","nori"], 1, "15 min", "rice", "Season rice. Cube tuna, marinate in soy and sesame. Top rice with tuna, avocado, cucumber, edamame."),
      r("Jambalaya", ["rice","shrimp","sausage","chicken","tomato","onion","bell pepper","celery","cajun seasoning"], 4, "40 min", "rice", "Saute sausage, chicken. Add onion, pepper, celery. Add tomato, cajun seasoning, rice, broth. Simmer. Add shrimp."),
      r("Fried Rice with Kimchi", ["rice","kimchi","pork","egg","green onion","soy sauce","sesame oil","gochujang"], 2, "15 min", "rice", "Stir-fry pork and chopped kimchi. Add rice, soy, gochujang. Top with fried egg, green onion."),
      r("Paella", ["rice","shrimp","chorizo","chicken","saffron","bell pepper","onion","garlic","tomato","peas"], 4, "45 min", "rice", "Saute chorizo, chicken. Add onion, pepper, garlic, tomato. Add rice, saffron, broth. Top with shrimp, peas. Simmer."),
      r("Onigiri", ["rice","nori","salmon","salt","sesame seeds"], 4, "15 min", "rice", "Season rice with salt. Form triangles. Fill with salmon. Wrap with nori. Sprinkle sesame."),
      r("Tabbouleh", ["bulgur","parsley","tomato","cucumber","lemon","olive oil","mint","onion"], 4, "15 min", "rice", "Cook bulgur. Chop parsley, tomato, cucumber, onion, mint. Toss with lemon and olive oil."),
      r("Grain Bowl", ["farro","sweet potato","kale","chickpeas","tahini","lemon","olive oil","red onion"], 2, "30 min", "rice", "Cook farro. Roast sweet potato, chickpeas. Massage kale. Assemble. Drizzle tahini-lemon dressing."),
      r("Oyakodon", ["rice","chicken","egg","onion","soy sauce","mirin","dashi","green onion"], 2, "20 min", "rice", "Simmer chicken, onion in dashi, soy, mirin. Pour beaten egg over. Cover. Serve over rice with green onion."),
      r("Mushroom Risotto", ["arborio rice","mushroom","onion","garlic","white wine","parmesan","butter","thyme"], 2, "35 min", "rice", "Saute mushrooms. Toast rice with onion, garlic. Add wine. Gradually add broth. Finish with mushrooms, parmesan, butter."),
      r("Coconut Rice", ["rice","coconut milk","sugar","salt","lime","cilantro"], 4, "20 min", "rice", "Cook rice in coconut milk with sugar and salt. Fluff. Garnish with lime and cilantro."),
      r("Shrimp Fried Rice", ["rice","shrimp","egg","soy sauce","garlic","ginger","green onion","peas","sesame oil"], 2, "15 min", "rice", "Stir-fry shrimp with garlic, ginger. Scramble egg. Add rice, peas, soy sauce, sesame oil. Top with green onion."),
      r("Arroz con Pollo", ["rice","chicken","tomato","onion","garlic","bell pepper","cumin","saffron","peas","olive oil"], 4, "40 min", "rice", "Brown chicken. Saute onion, garlic, pepper. Add rice, tomato, saffron, cumin, broth. Simmer. Add peas."),
      r("Loco Moco", ["rice","ground beef","egg","brown gravy","onion"], 1, "20 min", "rice", "Form beef patty, cook. Fry egg. Make gravy with onion. Serve patty over rice, top with gravy and egg."),
      r("Katsudon", ["rice","pork chop","egg","onion","panko","soy sauce","mirin","dashi"], 1, "25 min", "rice", "Bread pork in flour, egg, panko. Fry. Simmer onion in dashi, soy, mirin. Add katsu, pour egg. Serve over rice."),
      r("Thai Basil Fried Rice", ["rice","chicken","basil","garlic","chili","soy sauce","fish sauce","egg","oil"], 2, "15 min", "rice", "Stir-fry garlic, chili, chicken. Add rice, soy sauce, fish sauce. Toss with basil. Top with fried egg."),
      r("Mujaddara", ["lentils","rice","onion","cumin","olive oil","yogurt"], 4, "35 min", "rice", "Cook lentils and rice. Deeply caramelize onions in olive oil. Mix rice, lentils, cumin. Top with onions. Serve with yogurt."),
      r("Congee", ["rice","chicken broth","ginger","green onion","soy sauce","sesame oil","egg"], 2, "45 min", "rice", "Simmer rice in extra broth with ginger until porridge-like. Top with soy sauce, sesame oil, green onion, soft egg."),
      r("Wild Rice Pilaf", ["wild rice","onion","celery","mushroom","thyme","chicken broth","butter","almond"], 4, "45 min", "rice", "Saute onion, celery, mushroom. Add wild rice, broth, thyme. Simmer 40 min. Fluff. Toss with almonds, butter."),
      r("Acai Bowl", ["acai","banana","blueberry","granola","coconut","honey","almond butter"], 1, "10 min", "rice", "Blend acai, banana, blueberry. Pour into bowl. Top with granola, coconut, almond butter, honey."),
      r("Chirashi Bowl", ["rice","salmon","tuna","shrimp","avocado","cucumber","soy sauce","rice vinegar","nori","sesame seeds"], 1, "20 min", "rice", "Season rice with vinegar. Top with sliced fish, shrimp, avocado, cucumber. Garnish with nori, sesame, soy."),

      // ========== CHICKEN (35) ==========
      r("Honey Garlic Chicken", ["chicken","honey","garlic","soy sauce","butter","oil"], 4, "25 min", "chicken", "Sear chicken. Make sauce with honey, garlic, soy, butter. Coat chicken and simmer."),
      r("Lemon Herb Chicken", ["chicken","lemon","garlic","rosemary","thyme","olive oil","salt","pepper"], 4, "35 min", "chicken", "Marinate chicken with lemon, garlic, herbs, oil. Bake 400F 25-30 min."),
      r("Chicken Parmesan", ["chicken","bread crumbs","egg","parmesan","mozzarella","tomato sauce","basil"], 2, "30 min", "chicken", "Bread chicken. Fry golden. Top with sauce, mozzarella. Bake until melted."),
      r("Buffalo Chicken Wrap", ["chicken","tortilla","hot sauce","butter","lettuce","ranch dressing","celery"], 2, "20 min", "chicken", "Cook chicken. Toss with hot sauce and butter. Fill tortilla with chicken, lettuce, celery, ranch."),
      r("Chicken Tikka Masala", ["chicken","yogurt","tomato sauce","cream","onion","garlic","ginger","garam masala"], 4, "40 min", "chicken", "Marinate chicken in yogurt, spices. Cook. Make sauce with onion, garlic, ginger, tomato, cream, garam masala. Combine."),
      r("Thai Basil Chicken", ["chicken","basil","garlic","chili","soy sauce","fish sauce","sugar","oil"], 2, "15 min", "chicken", "Mince chicken. Stir-fry garlic, chili. Add chicken, soy, fish sauce, sugar. Toss with basil."),
      r("Chicken Caesar Wrap", ["chicken","tortilla","romaine lettuce","parmesan","caesar dressing","croutons"], 1, "15 min", "chicken", "Grill chicken. Fill tortilla with chicken, lettuce, parmesan, croutons, dressing."),
      r("Orange Chicken", ["chicken","orange juice","soy sauce","sugar","garlic","ginger","cornstarch","oil"], 2, "25 min", "chicken", "Coat chicken in cornstarch, fry. Make sauce with OJ, soy, sugar, garlic, ginger. Toss with chicken."),
      r("Butter Chicken", ["chicken","butter","tomato sauce","cream","garlic","ginger","garam masala","cumin"], 4, "35 min", "chicken", "Cook chicken. Simmer butter, tomato, garlic, ginger, spices. Add cream. Combine with chicken."),
      r("Chicken Fajitas", ["chicken","bell pepper","onion","tortilla","lime","cumin","chili powder","oil"], 2, "20 min", "chicken", "Slice and season chicken, peppers, onion. Stir-fry. Serve in warm tortillas with lime."),
      r("General Tso's Chicken", ["chicken","cornstarch","soy sauce","rice vinegar","sugar","garlic","ginger","chili","green onion"], 2, "25 min", "chicken", "Coat chicken in cornstarch, fry. Make sauce with soy, vinegar, sugar, garlic, ginger, chili. Toss. Top with green onion."),
      r("Chicken Satay", ["chicken","peanut butter","soy sauce","lime","coconut milk","curry powder","garlic","honey"], 4, "25 min", "chicken", "Marinate chicken in coconut milk, curry, garlic. Skewer, grill. Make peanut sauce with PB, soy, lime, honey."),
      r("Chicken Marsala", ["chicken","marsala wine","mushroom","butter","flour","garlic","parsley","olive oil"], 2, "25 min", "chicken", "Flour and sear chicken. Saute mushrooms, garlic. Add marsala wine, reduce. Add butter. Serve over chicken."),
      r("Chicken Piccata", ["chicken","lemon","capers","butter","white wine","flour","garlic","parsley"], 2, "20 min", "chicken", "Flour and sear chicken. Add garlic, wine, lemon, capers. Simmer. Finish with butter and parsley."),
      r("Chicken Alfredo", ["chicken","fettuccine","butter","cream","parmesan","garlic","pepper"], 2, "25 min", "chicken", "Cook pasta. Grill chicken. Make alfredo: butter, garlic, cream, parmesan. Slice chicken over pasta with sauce."),
      r("Chicken Lettuce Wraps", ["chicken","lettuce","water chestnuts","soy sauce","hoisin","garlic","ginger","green onion"], 2, "15 min", "chicken", "Stir-fry ground chicken with garlic, ginger, water chestnuts, soy, hoisin. Serve in lettuce cups with green onion."),
      r("Chicken Enchiladas", ["chicken","tortilla","enchilada sauce","cheese","onion","sour cream","cilantro"], 4, "35 min", "chicken", "Fill tortillas with chicken, cheese, onion. Roll. Cover with sauce, cheese. Bake 375F 20 min."),
      r("Chicken Pot Pie", ["chicken","peas","carrot","potato","onion","cream","butter","flour","puff pastry"], 4, "50 min", "chicken", "Make filling: saute onion, add flour, cream, chicken, peas, carrot, potato. Pour in dish. Top with pastry. Bake 400F 25 min."),
      r("Tandoori Chicken", ["chicken","yogurt","lemon","garlic","ginger","cumin","paprika","turmeric","cayenne"], 4, "35 min", "chicken", "Marinate chicken in yogurt, lemon, garlic, ginger, spices. Bake 425F or grill until charred."),
      r("Chicken Adobo", ["chicken","soy sauce","vinegar","garlic","bay leaf","pepper","oil","rice"], 4, "35 min", "chicken", "Brown chicken. Add soy, vinegar, garlic, bay leaf, pepper. Simmer 25 min. Serve over rice."),
      r("Kung Pao Chicken", ["chicken","peanuts","chili","soy sauce","rice vinegar","sugar","garlic","cornstarch"], 2, "20 min", "chicken", "Stir-fry chicken and chili. Add sauce of soy, vinegar, sugar, cornstarch. Toss with peanuts."),
      r("Chicken Shawarma", ["chicken","yogurt","cumin","paprika","turmeric","garlic","lemon","pita bread"], 4, "30 min", "chicken", "Marinate chicken in yogurt, spices. Grill. Slice. Serve in pita with veggies."),
      r("Jerk Chicken", ["chicken","allspice","thyme","scotch bonnet","garlic","ginger","soy sauce","lime","brown sugar"], 4, "40 min", "chicken", "Blend all spices into paste. Marinate chicken. Grill or bake until charred and cooked through."),
      r("Chicken Milanese", ["chicken","bread crumbs","egg","flour","arugula","tomato","lemon","parmesan","olive oil"], 2, "20 min", "chicken", "Pound chicken thin. Bread with flour, egg, breadcrumbs. Pan-fry. Top with arugula, tomato, parmesan, lemon."),
      r("Chicken Cordon Bleu", ["chicken","ham","gruyere","bread crumbs","egg","flour","butter","dijon mustard"], 2, "35 min", "chicken", "Pound chicken. Layer ham, cheese. Roll. Bread with flour, egg, crumbs. Bake 400F 25 min."),
      r("Chicken Yakitori", ["chicken","soy sauce","mirin","sake","sugar","green onion"], 4, "20 min", "chicken", "Cube chicken. Make tare: soy, mirin, sake, sugar. Simmer. Skewer chicken with green onion. Grill, basting with tare."),
      r("Chicken Souvlaki", ["chicken","lemon","garlic","oregano","olive oil","yogurt","cucumber","pita bread","tomato"], 4, "25 min", "chicken", "Marinate chicken in lemon, garlic, oregano, oil. Grill. Serve in pita with yogurt sauce, cucumber, tomato."),
      r("Chicken Katsu Curry", ["chicken","bread crumbs","egg","flour","curry roux","rice","potato","carrot"], 2, "35 min", "chicken", "Bread chicken: flour, egg, crumbs. Fry. Make curry with potato, carrot, roux. Slice katsu over rice with curry."),
      r("Chicken Stir-Fry", ["chicken","broccoli","bell pepper","carrot","soy sauce","garlic","ginger","cornstarch","oil"], 2, "20 min", "chicken", "Stir-fry chicken. Remove. Stir-fry veggies with garlic, ginger. Return chicken. Add soy sauce thickened with cornstarch."),
      r("BBQ Chicken", ["chicken","bbq sauce","garlic powder","paprika","brown sugar","oil"], 4, "35 min", "chicken", "Season chicken with garlic powder, paprika, brown sugar. Grill. Brush with BBQ sauce last 5 min."),
      r("Chicken Cacciatore", ["chicken","tomato","onion","bell pepper","garlic","olive","white wine","basil","oregano"], 4, "40 min", "chicken", "Brown chicken. Saute onion, pepper, garlic. Add tomato, wine, olives, herbs. Simmer 25 min."),
      r("Lemon Chicken Orzo Soup", ["chicken","orzo","lemon","egg","chicken broth","onion","carrot","dill"], 4, "30 min", "chicken", "Simmer chicken, onion, carrot in broth. Shred chicken. Add orzo. Whisk egg with lemon, temper into soup. Add dill."),
      r("Sticky Sesame Chicken", ["chicken","soy sauce","honey","sesame oil","garlic","ginger","cornstarch","sesame seeds","green onion"], 2, "25 min", "chicken", "Coat chicken in cornstarch, fry. Simmer soy, honey, garlic, ginger, sesame oil. Toss with chicken. Top with sesame, green onion."),
      r("Chicken Biryani", ["chicken","basmati rice","yogurt","onion","garlic","ginger","garam masala","saffron","cilantro","mint"], 4, "50 min", "chicken", "Marinate chicken in yogurt, spices. Fry onions. Layer rice and chicken. Add saffron milk. Cover, cook 20 min on low."),
      r("Green Curry Chicken", ["chicken","green curry paste","coconut milk","bamboo shoots","bell pepper","basil","fish sauce","sugar","rice"], 2, "25 min", "chicken", "Fry curry paste. Add coconut milk, chicken, bamboo, pepper. Simmer. Season with fish sauce, sugar. Serve with rice, basil."),

      // ========== BEEF (30) ==========
      r("Beef Tacos", ["ground beef","tortilla","lettuce","tomato","cheese","sour cream","taco seasoning"], 4, "20 min", "beef", "Brown beef with taco seasoning. Fill tortillas with beef, lettuce, tomato, cheese, sour cream."),
      r("Beef Stew", ["beef","potato","carrot","onion","garlic","tomato paste","beef broth","thyme"], 4, "90 min", "beef", "Brown beef. Add onion, garlic, tomato paste. Add broth, potatoes, carrots, thyme. Simmer 1 hour."),
      r("Beef Bulgogi", ["beef","soy sauce","sugar","sesame oil","garlic","ginger","pear","green onion"], 2, "25 min", "beef", "Slice beef thin. Marinate in soy, sugar, sesame oil, garlic, ginger, pear juice. Grill or pan-fry."),
      r("Hamburger", ["ground beef","bun","lettuce","tomato","onion","cheese","ketchup","mustard"], 2, "20 min", "beef", "Form patties. Grill 4 min per side. Toast bun. Assemble with toppings and condiments."),
      r("Meatballs", ["ground beef","bread crumbs","egg","parmesan","garlic","onion","tomato sauce","basil"], 4, "35 min", "beef", "Mix beef, breadcrumbs, egg, parmesan, garlic, onion. Form balls. Brown. Simmer in sauce."),
      r("Chili Con Carne", ["ground beef","kidney beans","tomato","onion","garlic","chili powder","cumin","bell pepper"], 4, "45 min", "beef", "Brown beef with onion, garlic, pepper. Add tomatoes, beans, chili powder, cumin. Simmer 30 min."),
      r("Steak with Chimichurri", ["steak","parsley","garlic","olive oil","red wine vinegar","oregano","red pepper flakes"], 2, "20 min", "beef", "Blend parsley, garlic, oil, vinegar, oregano, pepper flakes. Grill steak. Top with chimichurri."),
      r("Gyudon", ["beef","rice","onion","soy sauce","mirin","sugar","egg","ginger"], 2, "20 min", "beef", "Slice beef and onion. Simmer in soy, mirin, sugar, ginger. Top rice with beef mixture. Add soft egg."),
      r("Beef and Broccoli", ["beef","broccoli","soy sauce","garlic","ginger","cornstarch","brown sugar","sesame oil","rice"], 2, "20 min", "beef", "Slice beef, coat in cornstarch. Stir-fry. Make sauce: soy, brown sugar, garlic, ginger. Add broccoli. Serve over rice."),
      r("Philly Cheesesteak", ["beef","hoagie roll","provolone","onion","bell pepper","mushroom","oil"], 2, "20 min", "beef", "Slice beef thin. Saute onion, pepper, mushroom. Cook beef. Melt provolone over. Serve in roll."),
      r("Shepherd's Pie", ["ground beef","potato","carrot","peas","onion","garlic","tomato paste","beef broth","butter"], 4, "50 min", "beef", "Brown beef with onion, garlic, tomato paste. Add carrot, peas, broth. Mash potatoes. Top meat with mash. Bake 400F 20 min."),
      r("Beef Stroganoff", ["beef","mushroom","onion","garlic","sour cream","butter","flour","beef broth","egg noodles"], 4, "30 min", "beef", "Sear beef strips. Saute mushroom, onion, garlic. Make sauce with flour, broth, sour cream. Serve over noodles."),
      r("Meatloaf", ["ground beef","bread crumbs","egg","onion","ketchup","mustard","garlic","worcestershire"], 4, "60 min", "beef", "Mix beef, breadcrumbs, egg, onion, garlic, worcestershire. Shape loaf. Glaze with ketchup, mustard. Bake 350F 50 min."),
      r("Beef Burritos", ["ground beef","tortilla","rice","black beans","cheese","salsa","sour cream","lettuce"], 2, "20 min", "beef", "Brown beef with seasoning. Fill tortillas with rice, beef, beans, cheese, salsa, sour cream, lettuce."),
      r("Korean BBQ Short Ribs", ["short ribs","soy sauce","sugar","sesame oil","garlic","ginger","pear","green onion"], 4, "30 min", "beef", "Marinate ribs in soy, sugar, sesame oil, garlic, ginger, pear juice. Grill until caramelized."),
      r("Beef Curry", ["beef","potato","onion","garlic","ginger","curry powder","coconut milk","tomato","rice"], 4, "45 min", "beef", "Brown beef. Saute onion, garlic, ginger, curry powder. Add coconut milk, tomato, potato. Simmer 30 min."),
      r("Sloppy Joes", ["ground beef","onion","bell pepper","tomato sauce","ketchup","brown sugar","mustard","bun"], 4, "20 min", "beef", "Brown beef with onion, pepper. Add sauce, ketchup, brown sugar, mustard. Simmer. Serve on buns."),
      r("Steak Frites", ["steak","potato","oil","salt","pepper","butter","garlic","thyme"], 2, "30 min", "beef", "Cut potatoes into fries, fry until golden. Season steak. Sear in butter with garlic, thyme. Rest. Serve."),
      r("Beef Empanadas", ["ground beef","onion","garlic","cumin","paprika","olive","egg","empanada dough"], 8, "40 min", "beef", "Brown beef with onion, garlic, cumin, paprika, olives. Fill dough circles. Fold, crimp. Egg wash. Bake 400F 20 min."),
      r("Thai Beef Salad", ["beef","lime","fish sauce","chili","lemongrass","mint","cilantro","red onion","cucumber"], 2, "20 min", "beef", "Grill steak. Slice thin. Toss with lime, fish sauce, chili, lemongrass, mint, cilantro, onion, cucumber."),
      r("Cottage Pie", ["ground beef","potato","carrot","peas","corn","onion","tomato paste","beef broth","worcestershire"], 4, "50 min", "beef", "Brown beef with onion, tomato paste, worcestershire. Add veggies, broth. Mash potatoes. Top and bake 400F 20 min."),
      r("Mongolian Beef", ["beef","soy sauce","brown sugar","garlic","ginger","cornstarch","green onion","oil","rice"], 2, "20 min", "beef", "Slice beef, coat in cornstarch. Fry. Make sauce: soy, brown sugar, garlic, ginger. Toss with beef and green onion."),
      r("Beef Rendang", ["beef","coconut milk","lemongrass","galangal","garlic","ginger","chili","turmeric","onion"], 4, "120 min", "beef", "Blend aromatics into paste. Brown beef. Add paste, coconut milk. Simmer slowly until dry and dark, about 2 hours."),
      r("Carne Asada", ["steak","lime","garlic","cilantro","jalapeno","cumin","olive oil","tortilla","salsa"], 4, "25 min", "beef", "Marinate steak in lime, garlic, cilantro, jalapeno, cumin, oil. Grill. Slice thin. Serve with tortillas, salsa."),
      r("Beef Chow Fun", ["rice noodles","beef","soy sauce","oyster sauce","bean sprouts","green onion","oil","garlic"], 2, "15 min", "beef", "Slice beef, marinate in soy. Stir-fry noodles in hot wok. Add beef, bean sprouts, oyster sauce. Toss with green onion."),
      r("Beef Wellington", ["beef tenderloin","mushroom","puff pastry","dijon mustard","prosciutto","egg","thyme"], 4, "60 min", "beef", "Sear beef. Brush with mustard. Wrap in mushroom duxelles, prosciutto, pastry. Egg wash. Bake 425F 25 min."),
      r("Swedish Meatballs", ["ground beef","bread crumbs","egg","onion","cream","butter","flour","beef broth","allspice","nutmeg"], 4, "30 min", "beef", "Mix beef, crumbs, egg, onion, allspice, nutmeg. Form balls. Brown. Make gravy with butter, flour, broth, cream."),
      r("Ropa Vieja", ["flank steak","tomato","onion","bell pepper","garlic","cumin","oregano","olive oil","bay leaf"], 4, "120 min", "beef", "Brown steak. Add tomato, onion, pepper, garlic, cumin, oregano, bay leaf. Simmer 2 hours. Shred meat."),
      r("Beef Pho", ["rice noodles","beef broth","beef","star anise","cinnamon","fish sauce","bean sprouts","basil","lime","sriracha"], 2, "30 min", "beef", "Simmer broth with star anise, cinnamon, fish sauce. Cook noodles. Slice beef thin. Assemble with sprouts, basil, lime."),
      r("Beef Kebabs", ["beef","bell pepper","onion","mushroom","olive oil","garlic","oregano","lemon","salt","pepper"], 4, "25 min", "beef", "Cube beef. Marinate in oil, garlic, oregano, lemon. Thread onto skewers with veggies. Grill 10 min."),

      // ========== PORK (20) ==========
      r("Pulled Pork Sandwich", ["pork shoulder","bun","bbq sauce","onion","garlic","apple cider vinegar","brown sugar"], 6, "240 min", "pork", "Season pork. Slow cook 4-6 hours. Shred, mix with BBQ sauce. Serve on buns."),
      r("Pork Chops", ["pork chop","garlic","rosemary","butter","olive oil","salt","pepper"], 2, "20 min", "pork", "Season pork chops. Sear in oil. Add butter, garlic, rosemary. Baste. Rest 5 min."),
      r("Tonkatsu", ["pork chop","flour","egg","panko","cabbage","tonkatsu sauce","rice","lemon"], 2, "25 min", "pork", "Pound pork. Bread: flour, egg, panko. Deep fry until golden. Serve with shredded cabbage, sauce, rice."),
      r("Carnitas", ["pork shoulder","orange","lime","garlic","cumin","oregano","tortilla","cilantro","onion"], 6, "180 min", "pork", "Season pork with garlic, cumin, oregano. Add orange, lime. Braise 3 hours. Shred. Crisp under broiler. Serve in tortillas."),
      r("Pork Belly Bao", ["pork belly","bao bun","hoisin","cucumber","green onion","five spice","soy sauce","sugar"], 4, "90 min", "pork", "Season pork belly with five spice, soy, sugar. Roast until tender. Slice. Serve in bao with hoisin, cucumber, green onion."),
      r("Sweet and Sour Pork", ["pork","pineapple","bell pepper","onion","ketchup","rice vinegar","sugar","cornstarch","soy sauce"], 2, "25 min", "pork", "Coat pork in cornstarch, fry. Make sauce: ketchup, vinegar, sugar, soy. Add pineapple, pepper, onion. Toss with pork."),
      r("Char Siu Pork", ["pork","hoisin","soy sauce","honey","five spice","garlic","red food coloring","rice"], 4, "60 min", "pork", "Marinate pork in hoisin, soy, honey, five spice, garlic. Roast 375F, basting, until caramelized. Slice. Serve with rice."),
      r("Pork Schnitzel", ["pork","flour","egg","bread crumbs","lemon","butter","salt","pepper"], 2, "20 min", "pork", "Pound pork thin. Bread: flour, egg, breadcrumbs. Pan-fry in butter until golden. Serve with lemon."),
      r("Pork Ramen", ["pork belly","ramen","egg","green onion","soy sauce","miso paste","ginger","garlic","nori"], 2, "60 min", "pork", "Simmer pork belly in soy, ginger, garlic. Slice. Make broth with miso. Cook ramen. Assemble with egg, green onion, nori."),
      r("Pork Tacos al Pastor", ["pork","pineapple","achiote","garlic","onion","cilantro","lime","tortilla"], 4, "40 min", "pork", "Marinate pork in achiote, garlic, pineapple. Grill. Dice. Serve in tortillas with pineapple, onion, cilantro, lime."),
      r("Honey Mustard Pork Chops", ["pork chop","honey","dijon mustard","garlic","olive oil","thyme","salt","pepper"], 2, "20 min", "pork", "Mix honey, mustard, garlic, thyme. Season chops. Sear. Glaze with sauce. Bake 400F 15 min."),
      r("Italian Sausage and Peppers", ["Italian sausage","bell pepper","onion","garlic","tomato sauce","olive oil","basil","hoagie roll"], 4, "25 min", "pork", "Brown sausages. Saute peppers, onion, garlic. Add sauce, basil. Simmer. Serve on rolls."),
      r("Pork Gyoza", ["ground pork","cabbage","garlic","ginger","soy sauce","sesame oil","gyoza wrapper","rice vinegar"], 4, "30 min", "pork", "Mix pork, minced cabbage, garlic, ginger, soy, sesame oil. Fill wrappers. Fold. Pan-fry until crispy."),
      r("Bahn Mi", ["pork","baguette","carrot","daikon","cucumber","jalapeno","cilantro","mayonnaise","soy sauce","sugar","vinegar"], 2, "30 min", "pork", "Marinate pork in soy, sugar. Grill. Pickle carrot, daikon in vinegar. Assemble sandwich with all toppings."),
      r("Pork Fried Dumplings", ["ground pork","cabbage","garlic","ginger","soy sauce","sesame oil","dumpling wrapper","green onion","chili oil"], 4, "35 min", "pork", "Mix filling. Wrap dumplings. Pan-fry bottoms, add water, cover to steam. Serve with soy-chili dipping sauce."),
      r("Cuban Pork Sandwich", ["pork","ham","swiss cheese","pickle","mustard","bread","butter"], 2, "15 min", "pork", "Layer roasted pork, ham, swiss, pickle, mustard on bread. Butter outside. Press and grill until crispy."),
      r("Pork Vindaloo", ["pork","onion","garlic","ginger","vinegar","chili","cumin","turmeric","mustard seeds","tomato"], 4, "45 min", "pork", "Brown pork. Saute onion, garlic, ginger, spices. Add vinegar, tomato. Simmer 30 min. Serve with rice."),
      r("Pork Stir-Fry", ["pork","bell pepper","broccoli","carrot","soy sauce","garlic","ginger","cornstarch","oil","rice"], 2, "20 min", "pork", "Slice pork, coat in cornstarch. Stir-fry. Add veggies, garlic, ginger. Season with soy sauce. Serve over rice."),
      r("Glazed Ham Steak", ["ham steak","brown sugar","mustard","pineapple","butter","cloves"], 2, "15 min", "pork", "Mix brown sugar, mustard, cloves, butter. Sear ham steak. Add glaze and pineapple. Cook until caramelized."),
      r("Pork Pozole", ["pork","hominy","garlic","onion","chili","oregano","cabbage","radish","lime","cilantro"], 4, "60 min", "pork", "Simmer pork with garlic, onion, chili, oregano. Shred. Add hominy. Serve with cabbage, radish, lime, cilantro."),

      // ========== SEAFOOD (28) ==========
      r("Garlic Butter Shrimp", ["shrimp","garlic","butter","lemon","parsley","white wine","red pepper flakes"], 2, "15 min", "seafood", "Saute garlic in butter. Add shrimp, cook 2 min per side. Add wine, lemon. Garnish with parsley."),
      r("Fish Tacos", ["white fish","tortilla","cabbage","lime","sour cream","chili powder","cilantro"], 2, "20 min", "seafood", "Season fish. Pan-fry. Fill tortillas with fish, cabbage, sour cream, cilantro, lime."),
      r("Salmon Teriyaki", ["salmon","soy sauce","honey","garlic","ginger","sesame seeds","rice","broccoli"], 2, "20 min", "seafood", "Make glaze: soy, honey, garlic, ginger. Pan-sear salmon. Brush with glaze. Serve with rice, broccoli."),
      r("Cajun Shrimp", ["shrimp","cajun seasoning","butter","lemon","garlic","rice","parsley"], 2, "15 min", "seafood", "Season shrimp. Cook in butter with garlic. Squeeze lemon. Serve over rice with parsley."),
      r("Coconut Shrimp", ["shrimp","coconut","flour","egg","oil","sweet chili sauce"], 2, "20 min", "seafood", "Coat shrimp in flour, egg, coconut. Fry until golden. Serve with sweet chili sauce."),
      r("Fish and Chips", ["white fish","flour","beer","potato","oil","salt","lemon","tartar sauce"], 2, "30 min", "seafood", "Cut fries, fry. Make batter: flour, beer. Coat fish, fry. Serve with lemon and tartar sauce."),
      r("Ceviche", ["shrimp","lime","tomato","onion","cilantro","avocado","jalapeno","salt"], 4, "30 min", "seafood", "Dice shrimp. Marinate in lime 20 min. Mix with tomato, onion, jalapeno, cilantro, avocado."),
      r("Miso Glazed Salmon", ["salmon","miso paste","mirin","soy sauce","sugar","rice","green onion"], 2, "20 min", "seafood", "Mix miso, mirin, soy, sugar. Marinate salmon. Broil 8-10 min. Serve with rice, green onion."),
      r("Shrimp Tacos", ["shrimp","tortilla","cabbage","lime","chipotle","mayo","cilantro","avocado"], 2, "15 min", "seafood", "Season shrimp. Cook. Mix chipotle with mayo. Fill tortillas with shrimp, cabbage, avocado, sauce, cilantro."),
      r("Seared Tuna Steak", ["tuna","soy sauce","sesame seeds","wasabi","ginger","rice","green onion"], 2, "15 min", "seafood", "Coat tuna in sesame seeds. Sear 1 min per side. Slice. Serve with soy, wasabi, ginger, rice."),
      r("Clam Linguine", ["linguine","clam","garlic","white wine","butter","parsley","red pepper flakes","lemon"], 2, "20 min", "seafood", "Cook linguine. Saute garlic. Add clams, wine. Cover until open. Toss with pasta, parsley, lemon."),
      r("Fish Curry", ["white fish","coconut milk","curry paste","onion","garlic","ginger","lime","cilantro","rice"], 2, "25 min", "seafood", "Saute onion, garlic, ginger, curry paste. Add coconut milk. Add fish. Simmer. Serve with rice, cilantro, lime."),
      r("Lemon Butter Fish", ["white fish","butter","lemon","garlic","capers","parsley","flour"], 2, "15 min", "seafood", "Dust fish in flour. Pan-fry in butter. Add garlic, lemon, capers. Spoon sauce over. Garnish with parsley."),
      r("Shrimp Alfredo", ["fettuccine","shrimp","butter","cream","parmesan","garlic","parsley","pepper"], 2, "20 min", "seafood", "Cook pasta. Saute shrimp, garlic in butter. Add cream, parmesan. Toss with pasta. Top with parsley."),
      r("Blackened Fish", ["white fish","cajun seasoning","butter","lemon","rice","green beans"], 2, "15 min", "seafood", "Coat fish in cajun seasoning. Cook in hot butter 3 min per side. Serve with lemon, rice, green beans."),
      r("Shrimp Pad See Ew", ["rice noodles","shrimp","broccoli","egg","soy sauce","oyster sauce","garlic","sugar"], 2, "20 min", "seafood", "Stir-fry noodles in hot wok. Add shrimp, broccoli, garlic. Add sauces. Push aside, cook egg. Toss together."),
      r("Baked Salmon", ["salmon","lemon","garlic","dill","olive oil","salt","pepper","asparagus"], 2, "25 min", "seafood", "Place salmon on sheet pan with asparagus. Season with lemon, garlic, dill, oil. Bake 400F 15 min."),
      r("Tom Yum Soup", ["shrimp","lemongrass","lime","mushroom","chili","fish sauce","coconut milk","cilantro"], 2, "20 min", "seafood", "Simmer lemongrass in broth. Add mushrooms, chili, shrimp. Season with fish sauce, lime, coconut milk."),
      r("Lobster Roll", ["lobster","butter","mayonnaise","lemon","celery","chives","hot dog bun"], 2, "15 min", "seafood", "Cook lobster. Chop meat. Toss with mayo, lemon, celery. Butter and toast buns. Fill."),
      r("Crab Cakes", ["crab","mayonnaise","mustard","egg","bread crumbs","old bay","lemon","parsley"], 4, "25 min", "seafood", "Mix crab, mayo, mustard, egg, breadcrumbs, old bay. Form patties. Pan-fry until golden. Serve with lemon."),
      r("Seafood Paella", ["rice","shrimp","mussel","chorizo","saffron","bell pepper","onion","garlic","tomato","peas"], 4, "45 min", "seafood", "Saute chorizo, onion, pepper, garlic. Add rice, saffron, tomato, broth. Top with shrimp, mussels, peas. Cover, cook."),
      r("Honey Walnut Shrimp", ["shrimp","walnut","mayonnaise","honey","lemon","cornstarch","oil"], 2, "20 min", "seafood", "Candy walnuts. Coat shrimp in cornstarch, fry. Mix mayo, honey, lemon. Toss shrimp in sauce. Top with walnuts."),
      r("Salt and Pepper Shrimp", ["shrimp","salt","pepper","garlic","jalapeno","cornstarch","oil","green onion"], 2, "15 min", "seafood", "Coat shrimp in cornstarch. Fry until crispy. Toss with garlic, jalapeno, salt, pepper. Top with green onion."),
      r("Fish Piccata", ["white fish","lemon","capers","butter","white wine","flour","garlic","parsley"], 2, "20 min", "seafood", "Flour fish. Pan-fry. Add garlic, wine, lemon, capers. Simmer sauce. Finish with butter. Garnish with parsley."),
      r("Shrimp Coconut Curry", ["shrimp","coconut milk","curry paste","bell pepper","onion","garlic","fish sauce","basil","rice"], 2, "20 min", "seafood", "Fry curry paste. Add coconut milk, onion, pepper. Add shrimp. Season with fish sauce. Serve with rice, basil."),
      r("Grilled Octopus", ["octopus","olive oil","lemon","garlic","paprika","parsley","potato"], 2, "60 min", "seafood", "Boil octopus 45 min. Drain. Toss with oil, garlic, paprika. Grill until charred. Serve with potato, lemon, parsley."),
      r("Salmon Bowl", ["salmon","rice","avocado","edamame","cucumber","soy sauce","sesame oil","sesame seeds","nori"], 1, "20 min", "seafood", "Cook rice. Pan-sear salmon. Slice avocado, cucumber. Assemble bowl. Drizzle soy, sesame oil. Top with nori, sesame."),
      r("Shrimp Ceviche Tostada", ["shrimp","lime","tomato","avocado","onion","cilantro","jalapeno","tostada"], 4, "25 min", "seafood", "Make ceviche: shrimp, lime, tomato, onion, jalapeno, cilantro. Top tostadas with ceviche and avocado."),

      // ========== SOUP & STEW (28) ==========
      r("Tomato Soup", ["tomato","onion","garlic","butter","cream","basil"], 4, "30 min", "soup", "Saute onion, garlic in butter. Add tomatoes. Simmer. Blend smooth. Stir in cream, basil."),
      r("Chicken Noodle Soup", ["chicken","noodles","carrot","celery","onion","garlic","chicken broth","thyme"], 4, "35 min", "soup", "Saute onion, carrot, celery. Add broth, chicken, thyme. Simmer. Shred chicken. Add noodles."),
      r("Minestrone", ["pasta","kidney beans","tomato","carrot","celery","onion","garlic","spinach","parmesan"], 4, "35 min", "soup", "Saute onion, carrot, celery, garlic. Add tomatoes, beans, broth. Simmer. Add pasta, spinach."),
      r("Corn Chowder", ["corn","potato","bacon","onion","cream","butter","chicken broth","thyme"], 4, "30 min", "soup", "Cook bacon. Saute onion. Add potatoes, corn, broth. Simmer. Add cream, thyme."),
      r("French Onion Soup", ["onion","beef broth","butter","bread","gruyere","thyme","white wine"], 2, "45 min", "soup", "Caramelize onions 30 min. Add wine, broth. Simmer. Ladle into bowls, top with bread, cheese. Broil."),
      r("Miso Soup", ["miso paste","tofu","green onion","seaweed","dashi"], 2, "10 min", "soup", "Simmer dashi. Add tofu, seaweed. Remove from heat. Stir in miso. Top with green onion."),
      r("Clam Chowder", ["clam","potato","bacon","onion","cream","butter","flour","thyme"], 4, "35 min", "soup", "Cook bacon. Saute onion. Add flour, broth, potatoes. Simmer. Add clams, cream, thyme."),
      r("Butternut Squash Soup", ["butternut squash","onion","garlic","chicken broth","cream","nutmeg","butter"], 4, "40 min", "soup", "Roast squash. Saute onion, garlic. Add squash, broth. Simmer. Blend. Stir in cream, nutmeg."),
      r("Lentil Soup", ["lentils","onion","carrot","celery","garlic","cumin","tomato","olive oil"], 4, "35 min", "soup", "Saute onion, carrot, celery, garlic. Add lentils, tomato, cumin, water. Simmer 25 min."),
      r("Hot and Sour Soup", ["tofu","mushroom","bamboo shoots","egg","soy sauce","rice vinegar","chili oil","cornstarch","green onion"], 2, "20 min", "soup", "Simmer broth with mushrooms, bamboo, soy, vinegar. Add tofu. Thicken with cornstarch. Drizzle egg. Top with chili oil."),
      r("Tortilla Soup", ["chicken","tortilla","tomato","onion","garlic","chili powder","cumin","chicken broth","avocado","cheese"], 4, "30 min", "soup", "Saute onion, garlic. Add tomato, spices, broth. Simmer. Add chicken. Top with tortilla strips, avocado, cheese."),
      r("Wonton Soup", ["ground pork","wonton wrapper","chicken broth","green onion","ginger","soy sauce","sesame oil","bok choy"], 2, "25 min", "soup", "Mix pork, ginger, soy, sesame oil. Fill wontons. Simmer broth with ginger. Cook wontons. Add bok choy, green onion."),
      r("Pumpkin Soup", ["pumpkin","onion","garlic","cream","nutmeg","cinnamon","chicken broth","butter"], 4, "35 min", "soup", "Saute onion, garlic. Add pumpkin, broth. Simmer. Blend. Stir in cream, nutmeg, cinnamon."),
      r("Split Pea Soup", ["split peas","ham","onion","carrot","celery","garlic","thyme","bay leaf"], 4, "60 min", "soup", "Saute onion, carrot, celery. Add split peas, ham, thyme, bay leaf, water. Simmer 45 min."),
      r("Broccoli Cheddar Soup", ["broccoli","cheddar","onion","garlic","chicken broth","cream","butter","flour","nutmeg"], 4, "30 min", "soup", "Saute onion, garlic. Add flour, broth, cream. Simmer with broccoli. Blend partially. Stir in cheddar, nutmeg."),
      r("Egg Drop Soup", ["chicken broth","egg","green onion","cornstarch","soy sauce","sesame oil","ginger"], 2, "10 min", "soup", "Simmer broth with ginger. Thicken with cornstarch. Drizzle beaten egg slowly while stirring. Top with green onion."),
      r("Pozole", ["pork","hominy","chili","garlic","onion","oregano","cabbage","radish","lime","cilantro"], 4, "60 min", "soup", "Simmer pork with garlic, chili, oregano. Shred. Add hominy. Serve with cabbage, radish, lime, cilantro."),
      r("Gazpacho", ["tomato","cucumber","bell pepper","garlic","olive oil","red wine vinegar","bread","onion"], 4, "15 min", "soup", "Blend tomato, cucumber, pepper, garlic, bread, oil, vinegar. Chill. Serve cold with diced veggies."),
      r("Chicken Tortellini Soup", ["tortellini","chicken","chicken broth","spinach","carrot","onion","garlic","parmesan"], 4, "25 min", "soup", "Saute onion, carrot, garlic. Add broth, chicken. Simmer. Add tortellini, spinach. Cook 5 min. Top with parmesan."),
      r("Thai Coconut Soup", ["coconut milk","chicken","mushroom","lemongrass","lime","fish sauce","chili","cilantro","galangal"], 2, "20 min", "soup", "Simmer coconut milk with lemongrass, galangal. Add chicken, mushrooms. Season with fish sauce, lime, chili. Garnish cilantro."),
      r("Ribollita", ["bread","cannellini beans","kale","tomato","onion","carrot","celery","garlic","parmesan","olive oil"], 4, "40 min", "soup", "Saute onion, carrot, celery, garlic. Add tomato, beans, kale, broth. Simmer. Add bread to thicken. Drizzle oil."),
      r("Avgolemono", ["chicken","rice","egg","lemon","chicken broth","onion","dill"], 4, "30 min", "soup", "Simmer chicken in broth. Shred. Cook rice in broth. Whisk eggs with lemon. Temper into soup. Add dill."),
      r("Black Bean Soup", ["black beans","onion","garlic","cumin","chili powder","chicken broth","lime","sour cream","cilantro"], 4, "35 min", "soup", "Saute onion, garlic, cumin. Add beans, broth, chili powder. Simmer 20 min. Partially blend. Serve with lime, sour cream."),
      r("Potato Leek Soup", ["potato","leek","butter","chicken broth","cream","thyme","chives"], 4, "30 min", "soup", "Saute leeks in butter. Add potatoes, broth, thyme. Simmer 20 min. Blend. Stir in cream. Top with chives."),
      r("Cioppino", ["shrimp","clam","mussel","white fish","tomato","white wine","garlic","onion","basil","red pepper flakes"], 4, "35 min", "soup", "Saute onion, garlic, chili. Add tomato, wine. Simmer. Add seafood. Cover until shells open. Garnish basil."),
      r("Kimchi Jjigae", ["kimchi","pork","tofu","onion","garlic","gochugaru","soy sauce","green onion","rice"], 2, "25 min", "soup", "Saute pork and kimchi. Add water, gochugaru, soy. Simmer. Add tofu cubes. Cook 5 min. Top with green onion."),
      r("Chicken Congee", ["rice","chicken","ginger","garlic","chicken broth","soy sauce","sesame oil","green onion","egg"], 2, "45 min", "soup", "Simmer rice in broth with ginger until porridge. Cook chicken, shred. Top congee with chicken, soy, sesame oil, egg."),
      r("Borscht", ["beet","potato","cabbage","carrot","onion","garlic","dill","sour cream","beef broth","vinegar"], 4, "45 min", "soup", "Saute onion, carrot. Add beet, potato, cabbage, broth. Simmer 30 min. Add vinegar, dill. Serve with sour cream."),

      // ========== SALADS (22) ==========
      r("Caesar Salad", ["romaine lettuce","parmesan","croutons","caesar dressing","lemon"], 2, "10 min", "salad", "Chop romaine. Toss with dressing, parmesan, croutons. Squeeze lemon."),
      r("Greek Salad", ["cucumber","tomato","red onion","feta","olive","olive oil","oregano","lemon"], 2, "10 min", "salad", "Chop vegetables. Add olives, feta. Dress with olive oil, lemon, oregano."),
      r("Cobb Salad", ["lettuce","chicken","bacon","egg","avocado","tomato","blue cheese","ranch dressing"], 2, "20 min", "salad", "Arrange rows of chicken, bacon, hard-boiled egg, avocado, tomato, blue cheese on lettuce. Drizzle ranch."),
      r("Asian Sesame Salad", ["cabbage","carrot","edamame","green onion","sesame seeds","soy sauce","rice vinegar","sesame oil"], 2, "10 min", "salad", "Shred cabbage, carrot. Add edamame. Dress with soy, rice vinegar, sesame oil. Top with sesame seeds."),
      r("Waldorf Salad", ["apple","celery","walnut","grape","mayonnaise","lemon","lettuce"], 2, "10 min", "salad", "Dice apple, celery. Halve grapes. Toss with walnuts, mayo, lemon. Serve on lettuce."),
      r("Kale Salad", ["kale","lemon","olive oil","parmesan","almond","cranberry","salt"], 2, "10 min", "salad", "Massage kale with lemon, olive oil, salt. Top with parmesan, almonds, cranberries."),
      r("Nicoise Salad", ["tuna","egg","green beans","potato","olive","tomato","anchovy","olive oil","dijon mustard"], 2, "20 min", "salad", "Boil eggs, potatoes, green beans. Arrange with tuna, olives, tomato, anchovy. Dress with oil and mustard."),
      r("Fattoush Salad", ["pita bread","cucumber","tomato","radish","parsley","mint","olive oil","lemon","sumac"], 2, "15 min", "salad", "Toast pita pieces. Chop veggies. Toss with parsley, mint, olive oil, lemon, sumac, pita."),
      r("Chopped Salad", ["lettuce","cucumber","tomato","bell pepper","chickpeas","feta","red onion","olive oil","red wine vinegar"], 2, "10 min", "salad", "Chop all vegetables small. Toss with chickpeas, feta, olive oil, vinegar."),
      r("Watermelon Feta Salad", ["watermelon","feta","mint","lime","olive oil","salt"], 4, "10 min", "salad", "Cube watermelon. Crumble feta. Tear mint. Toss with lime, olive oil, salt."),
      r("Thai Papaya Salad", ["green papaya","tomato","green beans","peanuts","lime","fish sauce","chili","garlic","sugar"], 2, "15 min", "salad", "Shred papaya. Pound garlic, chili, beans. Add papaya, tomato, fish sauce, lime, sugar. Top with peanuts."),
      r("Panzanella", ["bread","tomato","cucumber","red onion","basil","olive oil","red wine vinegar","mozzarella"], 2, "15 min", "salad", "Cube and toast bread. Chop tomato, cucumber, onion. Toss with basil, mozzarella, oil, vinegar."),
      r("Couscous Salad", ["couscous","cucumber","tomato","parsley","mint","lemon","olive oil","feta","red onion"], 2, "15 min", "salad", "Cook couscous. Chill. Toss with chopped veggies, herbs, feta, lemon, olive oil."),
      r("Southwest Salad", ["lettuce","corn","black beans","avocado","tomato","cheese","tortilla chips","ranch dressing","lime"], 2, "15 min", "salad", "Chop lettuce. Add corn, beans, avocado, tomato, cheese. Top with crushed chips. Dress with ranch, lime."),
      r("Arugula Salad", ["arugula","parmesan","pine nuts","lemon","olive oil","pear","balsamic vinegar"], 2, "10 min", "salad", "Toss arugula with lemon, olive oil. Top with shaved parmesan, pine nuts, sliced pear, balsamic."),
      r("Taco Salad", ["ground beef","lettuce","tomato","cheese","sour cream","tortilla chips","salsa","black beans","avocado"], 2, "20 min", "salad", "Brown beef with taco seasoning. Layer lettuce, beef, beans, tomato, cheese, avocado, chips. Top with salsa, sour cream."),
      r("Fruit Salad", ["strawberry","blueberry","banana","grape","orange","honey","mint"], 4, "10 min", "salad", "Chop all fruits. Toss gently. Drizzle honey. Garnish with mint."),
      r("Spinach Strawberry Salad", ["spinach","strawberry","goat cheese","pecan","balsamic vinegar","olive oil","red onion"], 2, "10 min", "salad", "Toss spinach with sliced strawberries, goat cheese, pecans, sliced onion. Dress with balsamic, olive oil."),
      r("Larb", ["ground chicken","lime","fish sauce","chili","mint","cilantro","red onion","rice powder","lettuce"], 2, "15 min", "salad", "Cook chicken. Toss with lime, fish sauce, chili, onion, rice powder, herbs. Serve in lettuce cups."),
      r("Roasted Beet Salad", ["beet","goat cheese","walnut","arugula","balsamic vinegar","olive oil","honey"], 2, "45 min", "salad", "Roast beets. Slice. Arrange on arugula. Top with goat cheese, walnuts. Dress with balsamic-honey vinaigrette."),
      r("Corn Salad", ["corn","tomato","avocado","red onion","cilantro","lime","jalapeno","olive oil"], 4, "10 min", "salad", "Cut corn off cob. Mix with tomato, avocado, onion, jalapeno, cilantro. Dress with lime, olive oil."),
      r("Pasta Salad", ["rotini","tomato","cucumber","olive","red onion","feta","Italian dressing","bell pepper","parsley"], 4, "15 min", "salad", "Cook pasta. Chill. Toss with chopped veggies, olives, feta, Italian dressing."),

      // ========== MEXICAN & LATIN (22) ==========
      r("Guacamole", ["avocado","lime","onion","tomato","cilantro","jalapeno","salt"], 4, "10 min", "mexican", "Mash avocado. Mix in onion, tomato, jalapeno, cilantro, lime, salt."),
      r("Enchiladas", ["tortilla","chicken","enchilada sauce","cheese","onion","sour cream","cilantro"], 4, "35 min", "mexican", "Fill tortillas with chicken, cheese, onion. Roll. Cover with sauce, cheese. Bake 375F 20 min."),
      r("Nachos", ["tortilla chips","cheese","ground beef","jalapeno","sour cream","salsa","guacamole"], 4, "15 min", "mexican", "Layer chips with beef, cheese. Bake until melted. Top with jalapeno, sour cream, salsa, guacamole."),
      r("Elote", ["corn","mayonnaise","cotija cheese","chili powder","lime","cilantro","butter"], 4, "15 min", "mexican", "Grill corn. Brush with mayo, butter. Sprinkle cotija, chili powder. Squeeze lime, add cilantro."),
      r("Black Bean Tacos", ["tortilla","black beans","avocado","salsa","lime","cilantro","cheese"], 2, "15 min", "mexican", "Heat beans. Warm tortillas. Fill with beans, avocado, salsa, cheese, cilantro, lime."),
      r("Tamales", ["masa","pork","corn husk","chili sauce","lard","salt"], 12, "120 min", "mexican", "Soak husks. Beat masa with lard, salt. Spread on husks. Fill with pork, sauce. Fold. Steam 1 hour."),
      r("Empanadas", ["empanada dough","ground beef","onion","olive","egg","cumin","paprika","garlic"], 8, "40 min", "mexican", "Brown beef with onion, garlic, cumin, paprika, olives. Fill dough. Fold, crimp. Egg wash. Bake 400F 20 min."),
      r("Tostadas", ["tostada shell","black beans","lettuce","tomato","cheese","sour cream","avocado","salsa"], 4, "15 min", "mexican", "Spread beans on tostadas. Layer lettuce, tomato, cheese, avocado, sour cream, salsa."),
      r("Churros", ["flour","butter","sugar","egg","cinnamon","salt","oil","chocolate sauce"], 8, "30 min", "mexican", "Heat water, butter, sugar, salt. Add flour. Cook. Add eggs. Pipe into oil. Fry. Roll in cinnamon sugar. Dip in chocolate."),
      r("Esquites", ["corn","mayonnaise","cotija cheese","chili powder","lime","cilantro","butter"], 4, "15 min", "mexican", "Char corn kernels in butter. Mix with mayo, cotija, chili powder, lime, cilantro. Serve in cups."),
      r("Birria Tacos", ["beef","chili","tomato","onion","garlic","cumin","oregano","tortilla","cheese","cilantro","lime"], 4, "180 min", "mexican", "Simmer beef with chili, tomato, onion, spices 2.5 hours. Shred. Dip tortillas in consomme. Fill with beef, cheese. Fry."),
      r("Salsa Verde", ["tomatillo","jalapeno","onion","garlic","cilantro","lime","salt"], 6, "15 min", "mexican", "Roast tomatillos, jalapeno. Blend with onion, garlic, cilantro, lime, salt."),
      r("Chicken Mole", ["chicken","chocolate","chili","tomato","onion","garlic","sesame seeds","cinnamon","cumin","tortilla"], 4, "60 min", "mexican", "Toast chilis. Blend with tomato, onion, garlic, chocolate, spices. Simmer. Add cooked chicken. Serve with tortillas."),
      r("Pupusas", ["masa","cheese","beans","cabbage","tomato sauce","vinegar"], 4, "30 min", "mexican", "Fill masa with cheese, beans. Form thick tortillas. Cook on griddle. Serve with curtido and sauce."),
      r("Flautas", ["tortilla","chicken","cheese","oil","lettuce","sour cream","salsa","avocado"], 4, "20 min", "mexican", "Fill tortillas with chicken, cheese. Roll tight. Fry until crispy. Serve with lettuce, sour cream, salsa, avocado."),
      r("Tres Leches Cake", ["flour","sugar","egg","butter","vanilla","whole milk","condensed milk","evaporated milk","cream"], 8, "45 min", "mexican", "Make sponge cake. Poke holes. Pour three milks mixture over. Soak. Top with whipped cream."),
      r("Pico de Gallo", ["tomato","onion","jalapeno","cilantro","lime","salt"], 4, "10 min", "mexican", "Dice tomato, onion, jalapeno. Mix with cilantro, lime, salt."),
      r("Sopes", ["masa","black beans","lettuce","cheese","sour cream","salsa","chicken"], 4, "25 min", "mexican", "Form masa into thick rounds. Cook. Pinch edges up. Fill with beans, chicken, lettuce, cheese, sour cream, salsa."),
      r("Agua Fresca", ["watermelon","lime","sugar","water","mint"], 6, "10 min", "mexican", "Blend watermelon with water, lime, sugar. Strain. Serve over ice with mint."),
      r("Mexican Rice", ["rice","tomato sauce","onion","garlic","chicken broth","cumin","oil"], 4, "25 min", "mexican", "Toast rice in oil. Add onion, garlic. Add tomato sauce, broth, cumin. Cover. Simmer 20 min."),
      r("Chiles Rellenos", ["poblano pepper","cheese","egg","flour","tomato sauce","oil"], 4, "30 min", "mexican", "Roast and peel poblanos. Stuff with cheese. Coat in flour and egg batter. Fry. Serve with tomato sauce."),
      r("Carne Guisada", ["beef","tomato","onion","bell pepper","garlic","cumin","flour","beef broth","tortilla"], 4, "90 min", "mexican", "Brown beef. Saute onion, pepper, garlic. Add flour, tomato, broth, cumin. Simmer 1 hour. Serve with tortillas."),

      // ========== INDIAN (25) ==========
      r("Dal Tadka", ["lentils","onion","tomato","garlic","ginger","cumin","turmeric","chili","cilantro","ghee"], 4, "30 min", "indian", "Cook lentils with turmeric. Make tadka: ghee, cumin, garlic, ginger, onion, tomato, chili. Pour over dal. Garnish cilantro."),
      r("Palak Paneer", ["paneer","spinach","onion","garlic","ginger","cream","cumin","garam masala","green chili"], 4, "30 min", "indian", "Blanch and blend spinach. Saute onion, garlic, ginger, chili, spices. Add spinach puree, cream, paneer cubes."),
      r("Chana Masala", ["chickpeas","onion","tomato","garlic","ginger","cumin","coriander","garam masala","chili","cilantro"], 4, "30 min", "indian", "Saute onion, garlic, ginger, spices. Add tomato. Add chickpeas, water. Simmer 20 min. Garnish cilantro."),
      r("Aloo Gobi", ["potato","cauliflower","onion","tomato","garlic","ginger","turmeric","cumin","coriander","cilantro"], 4, "30 min", "indian", "Saute onion, garlic, ginger, spices. Add potato, cauliflower. Cook covered until tender. Garnish cilantro."),
      r("Samosa", ["potato","peas","flour","cumin","coriander","garam masala","ginger","chili","oil"], 8, "45 min", "indian", "Make dough with flour. Cook filling: potato, peas, spices. Form triangles. Fill. Deep fry until golden."),
      r("Biryani", ["basmati rice","chicken","yogurt","onion","garlic","ginger","garam masala","saffron","cilantro","mint"], 4, "50 min", "indian", "Marinate chicken. Fry onions. Layer rice and chicken. Add saffron milk. Cook on low 20 min."),
      r("Naan", ["flour","yogurt","yeast","sugar","salt","butter","garlic"], 4, "30 min", "indian", "Mix flour, yeast, sugar, salt, yogurt. Knead. Rise 1 hour. Roll. Cook in hot pan. Brush with garlic butter."),
      r("Tikka Masala", ["chicken","yogurt","tomato sauce","cream","onion","garlic","ginger","garam masala","cumin","paprika"], 4, "40 min", "indian", "Marinate chicken in yogurt, spices. Cook. Make masala sauce. Combine. Finish with cream."),
      r("Raita", ["yogurt","cucumber","cumin","mint","salt","chili powder"], 4, "5 min", "indian", "Grate cucumber, squeeze dry. Mix with yogurt, cumin, mint, salt, chili powder."),
      r("Paneer Tikka", ["paneer","yogurt","garlic","ginger","cumin","turmeric","chili","bell pepper","onion","lemon"], 4, "25 min", "indian", "Marinate paneer cubes in yogurt, spices. Thread with peppers, onion. Grill or broil until charred."),
      r("Keema", ["ground lamb","onion","tomato","garlic","ginger","cumin","coriander","garam masala","peas","cilantro"], 4, "30 min", "indian", "Brown lamb. Saute onion, garlic, ginger, spices. Add tomato. Simmer. Add peas. Garnish cilantro."),
      r("Vindaloo", ["pork","onion","garlic","ginger","vinegar","chili","cumin","turmeric","mustard seeds","tomato"], 4, "45 min", "indian", "Brown pork. Saute onion, garlic, ginger, spices. Add vinegar, tomato. Simmer 30 min."),
      r("Saag", ["spinach","mustard greens","onion","garlic","ginger","green chili","cream","butter","cumin"], 4, "30 min", "indian", "Cook greens. Blend. Saute onion, garlic, ginger, chili, cumin in butter. Add puree, cream. Simmer."),
      r("Malai Kofta", ["paneer","potato","cream","tomato","onion","garlic","ginger","cashew","garam masala","saffron"], 4, "45 min", "indian", "Make kofta: paneer, potato. Fry. Make gravy: onion, tomato, cashew, cream, spices. Add kofta to gravy."),
      r("Masala Dosa", ["rice","urad dal","potato","onion","mustard seeds","turmeric","chili","curry leaves","oil"], 4, "30 min", "indian", "Soak and grind rice, dal for batter. Ferment. Cook thin crepe. Fill with spiced potato masala."),
      r("Rajma", ["kidney beans","onion","tomato","garlic","ginger","cumin","coriander","garam masala","chili","cilantro"], 4, "40 min", "indian", "Saute onion, garlic, ginger, spices. Add tomato. Add cooked beans, water. Simmer 20 min. Serve with rice."),
      r("Korma", ["chicken","yogurt","onion","garlic","ginger","almond","cream","cardamom","cinnamon","saffron"], 4, "40 min", "indian", "Brown chicken. Saute onion, garlic, ginger. Add blended almonds, yogurt, spices. Simmer. Finish with cream, saffron."),
      r("Pakora", ["chickpea flour","onion","potato","spinach","cumin","chili","salt","oil"], 4, "20 min", "indian", "Mix vegetables with chickpea flour, spices, water into batter. Drop spoonfuls into hot oil. Fry until crispy."),
      r("Tandoori Fish", ["white fish","yogurt","lemon","garlic","ginger","turmeric","chili","cumin","paprika"], 2, "25 min", "indian", "Marinate fish in yogurt, lemon, spices. Bake or grill until charred and flaky."),
      r("Bhindi Masala", ["okra","onion","tomato","garlic","ginger","cumin","coriander","turmeric","chili","oil"], 4, "25 min", "indian", "Fry okra until crispy. Saute onion, garlic, ginger, spices. Add tomato, okra. Cook until tender."),
      r("Matar Paneer", ["paneer","peas","onion","tomato","garlic","ginger","cumin","garam masala","cream","cilantro"], 4, "25 min", "indian", "Saute onion, garlic, ginger, spices. Add tomato. Simmer. Add peas, paneer, cream. Garnish cilantro."),
      r("Chicken 65", ["chicken","yogurt","cornstarch","chili","garlic","ginger","curry leaves","egg","oil"], 4, "25 min", "indian", "Marinate chicken in yogurt, spices, cornstarch, egg. Deep fry until crispy. Toss with curry leaves, chilies."),
      r("Lamb Rogan Josh", ["lamb","onion","yogurt","garlic","ginger","kashmiri chili","cardamom","cinnamon","fennel","saffron"], 4, "90 min", "indian", "Brown lamb. Saute onion, garlic, ginger. Add yogurt, spices, saffron. Simmer 1 hour until tender."),
      r("Pav Bhaji", ["potato","cauliflower","peas","bell pepper","onion","tomato","butter","pav bhaji masala","bread roll","lemon"], 4, "30 min", "indian", "Boil and mash veggies. Saute onion, tomato, spices in butter. Add veggies. Mash together. Serve with buttered rolls."),
      r("Gulab Jamun", ["milk powder","flour","butter","sugar","cardamom","rose water","oil","baking soda"], 12, "30 min", "indian", "Mix milk powder, flour, butter, baking soda. Form balls. Fry. Soak in cardamom-rose sugar syrup."),

      // ========== MEDITERRANEAN & MIDDLE EASTERN (18) ==========
      r("Falafel", ["chickpeas","onion","garlic","parsley","cumin","flour","oil","pita bread"], 4, "30 min", "mediterranean", "Blend chickpeas, onion, garlic, parsley, cumin. Form patties. Fry until golden. Serve in pita."),
      r("Tzatziki", ["yogurt","cucumber","garlic","lemon","dill","olive oil","salt"], 4, "10 min", "mediterranean", "Grate cucumber, squeeze dry. Mix with yogurt, garlic, lemon, dill, olive oil, salt."),
      r("Tabbouleh", ["bulgur","parsley","tomato","cucumber","lemon","olive oil","mint","onion"], 4, "15 min", "mediterranean", "Cook bulgur. Chop veggies and herbs. Toss with lemon, olive oil."),
      r("Hummus", ["chickpeas","tahini","lemon","garlic","olive oil","cumin","salt"], 6, "10 min", "mediterranean", "Blend chickpeas, tahini, lemon, garlic, cumin, salt, olive oil until smooth. Drizzle with oil."),
      r("Baba Ganoush", ["eggplant","tahini","garlic","lemon","olive oil","parsley","salt"], 4, "30 min", "mediterranean", "Roast eggplant until charred. Scoop flesh. Blend with tahini, garlic, lemon. Drizzle oil, parsley."),
      r("Shawarma Plate", ["chicken","rice","hummus","tomato","cucumber","pickled turnip","garlic sauce","pita"], 2, "30 min", "mediterranean", "Grill shawarma chicken. Serve with rice, hummus, salad, pickles, garlic sauce, pita."),
      r("Kafta Kebab", ["ground lamb","onion","parsley","cumin","coriander","paprika","allspice","pita","tahini"], 4, "20 min", "mediterranean", "Mix lamb with onion, parsley, spices. Form onto skewers. Grill. Serve with pita, tahini."),
      r("Fattoush", ["pita bread","cucumber","tomato","radish","parsley","mint","olive oil","lemon","sumac"], 2, "15 min", "mediterranean", "Toast pita. Chop veggies. Toss with herbs, olive oil, lemon, sumac, pita."),
      r("Moussaka", ["eggplant","ground lamb","tomato sauce","onion","garlic","cinnamon","bechamel","parmesan"], 6, "60 min", "mediterranean", "Slice and fry eggplant. Make meat sauce with lamb, onion, garlic, tomato, cinnamon. Layer. Top with bechamel. Bake 375F 40 min."),
      r("Spanakopita", ["spinach","feta","onion","egg","dill","phyllo dough","butter"], 6, "45 min", "mediterranean", "Saute spinach, onion. Mix with feta, egg, dill. Layer phyllo with butter. Add filling. Bake 375F 30 min."),
      r("Labneh", ["yogurt","salt","olive oil","za'atar","pita"], 4, "5 min", "mediterranean", "Strain yogurt overnight. Spread on plate. Drizzle olive oil. Sprinkle za'atar. Serve with pita."),
      r("Shakshuka", ["egg","tomato","onion","garlic","bell pepper","cumin","paprika","olive oil","feta","cilantro"], 2, "25 min", "mediterranean", "Saute onion, pepper, garlic. Add tomatoes, spices. Crack eggs in. Cover until set. Top with feta, cilantro."),
      r("Lamb Kofta", ["ground lamb","onion","garlic","cumin","coriander","mint","parsley","yogurt","cucumber","pita"], 4, "25 min", "mediterranean", "Mix lamb with onion, garlic, spices, herbs. Form onto skewers. Grill. Serve with yogurt-cucumber sauce, pita."),
      r("Muhammara", ["roasted red pepper","walnut","bread crumbs","pomegranate molasses","garlic","cumin","olive oil","chili"], 6, "15 min", "mediterranean", "Blend peppers, walnuts, bread, pomegranate molasses, garlic, cumin, chili. Drizzle olive oil."),
      r("Kibbeh", ["ground lamb","bulgur","onion","pine nuts","allspice","cinnamon","cumin","oil"], 8, "45 min", "mediterranean", "Soak bulgur. Mix with lamb, onion, spices. Form shells. Fill with pine nut mixture. Fry or bake."),
      r("Mansaf", ["lamb","yogurt","rice","almond","pine nuts","cardamom","turmeric","onion","ghee"], 4, "90 min", "mediterranean", "Cook lamb in yogurt sauce with cardamom. Serve over rice. Top with almonds, pine nuts."),
      r("Koshari", ["rice","lentils","macaroni","tomato sauce","onion","garlic","cumin","vinegar","chili"], 4, "35 min", "mediterranean", "Cook rice, lentils, pasta separately. Fry onions. Layer all. Top with spiced tomato sauce."),
      r("Baklava", ["phyllo dough","walnut","pistachio","butter","sugar","honey","cinnamon","lemon","rose water"], 12, "45 min", "mediterranean", "Layer buttered phyllo with nut mixture. Score. Bake 350F 40 min. Pour honey syrup over."),

      // ========== ITALIAN (15) ==========
      r("Garlic Bread", ["bread","butter","garlic","parsley","parmesan"], 4, "15 min", "italian", "Mix butter with garlic, parsley. Spread on bread. Top with parmesan. Bake until golden."),
      r("Margherita Pizza", ["pizza dough","tomato sauce","mozzarella","basil","olive oil"], 2, "20 min", "italian", "Roll dough. Spread sauce. Add mozzarella. Bake 475F 10-12 min. Top with basil, oil."),
      r("Eggplant Parmesan", ["eggplant","bread crumbs","egg","parmesan","mozzarella","tomato sauce","basil"], 4, "45 min", "italian", "Slice eggplant. Bread. Fry. Layer with sauce, mozzarella. Bake 375F 25 min."),
      r("Bruschetta al Pomodoro", ["bread","tomato","garlic","basil","olive oil","salt"], 4, "10 min", "italian", "Dice tomatoes with garlic, basil, oil, salt. Toast bread. Rub with garlic. Top with tomato mixture."),
      r("Caprese Grilled Cheese", ["bread","mozzarella","tomato","basil","butter","balsamic vinegar"], 1, "10 min", "italian", "Layer mozzarella, tomato, basil between bread. Grill in butter. Drizzle balsamic."),
      r("Minestrone Soup", ["pasta","cannellini beans","tomato","zucchini","carrot","celery","onion","garlic","basil","parmesan"], 4, "35 min", "italian", "Saute onion, carrot, celery, garlic. Add tomato, beans, zucchini, broth. Add pasta. Top with basil, parmesan."),
      r("Arancini", ["rice","mozzarella","parmesan","egg","bread crumbs","tomato sauce","oil"], 6, "35 min", "italian", "Cook risotto. Cool. Form balls around mozzarella. Coat in egg, breadcrumbs. Fry. Serve with sauce."),
      r("Panzanella", ["bread","tomato","cucumber","red onion","basil","olive oil","red wine vinegar","mozzarella"], 2, "15 min", "italian", "Cube and toast bread. Chop veggies. Toss with basil, mozzarella, oil, vinegar."),
      r("Tiramisu", ["mascarpone","espresso","ladyfingers","egg","sugar","cocoa powder","rum"], 6, "30 min", "italian", "Whisk egg yolks with sugar. Fold in mascarpone. Dip ladyfingers in espresso-rum. Layer. Dust with cocoa. Chill."),
      r("Focaccia", ["flour","yeast","olive oil","salt","rosemary","garlic","water"], 6, "90 min", "italian", "Mix dough. Rise 1 hour. Press into pan. Dimple. Top with olive oil, rosemary, garlic, salt. Bake 425F 20 min."),
      r("Insalata Caprese", ["tomato","mozzarella","basil","olive oil","balsamic vinegar","salt","pepper"], 2, "5 min", "italian", "Slice tomato and mozzarella. Alternate with basil. Drizzle oil, balsamic. Season."),
      r("Osso Buco", ["veal shank","onion","carrot","celery","tomato","white wine","garlic","lemon zest","parsley","chicken broth"], 4, "120 min", "italian", "Brown shanks. Saute onion, carrot, celery. Add wine, tomato, broth. Braise 2 hours. Top with gremolata."),
      r("Suppli", ["rice","mozzarella","tomato sauce","parmesan","egg","bread crumbs","ground beef","oil"], 8, "40 min", "italian", "Make risotto with sauce, beef. Cool. Form balls around mozzarella. Bread. Fry until golden."),
      r("Ribollita", ["bread","cannellini beans","kale","tomato","onion","carrot","celery","garlic","parmesan","olive oil"], 4, "40 min", "italian", "Saute veggies. Add tomato, beans, kale. Simmer. Add bread to thicken. Drizzle oil, parmesan."),
      r("Crostini", ["bread","ricotta","prosciutto","fig","honey","arugula","olive oil"], 4, "10 min", "italian", "Toast bread slices. Spread ricotta. Top with prosciutto, fig, arugula. Drizzle honey, oil."),

      // ========== VEGETARIAN (22) ==========
      r("Veggie Burger", ["black beans","bread crumbs","egg","onion","garlic","cumin","bun","lettuce"], 2, "25 min", "vegetarian", "Mash beans. Mix with crumbs, egg, onion, garlic, cumin. Form patties. Pan-fry. Serve on bun."),
      r("Stuffed Bell Peppers", ["bell pepper","rice","tomato sauce","onion","cheese","garlic","corn","black beans"], 4, "45 min", "vegetarian", "Hollow peppers. Mix rice, beans, corn, sauce, onion. Stuff. Top with cheese. Bake 375F 30 min."),
      r("Vegetable Curry", ["potato","cauliflower","chickpeas","coconut milk","curry powder","onion","garlic","ginger"], 4, "30 min", "vegetarian", "Saute onion, garlic, ginger, curry powder. Add veggies, chickpeas, coconut milk. Simmer 20 min."),
      r("Mushroom Risotto", ["arborio rice","mushroom","onion","garlic","white wine","parmesan","butter","thyme"], 2, "35 min", "vegetarian", "Saute mushrooms. Toast rice. Add wine. Gradually add broth. Finish with mushrooms, parmesan, butter."),
      r("Caprese Sandwich", ["bread","mozzarella","tomato","basil","pesto","balsamic vinegar"], 1, "10 min", "vegetarian", "Spread pesto on bread. Layer mozzarella, tomato, basil. Drizzle balsamic."),
      r("Ratatouille", ["eggplant","zucchini","bell pepper","tomato","onion","garlic","basil","thyme","olive oil"], 4, "45 min", "vegetarian", "Slice vegetables thin. Layer in baking dish with sauce. Drizzle oil, herbs. Bake 375F 40 min."),
      r("Spinach Artichoke Dip", ["spinach","artichoke","cream cheese","parmesan","garlic","mozzarella","sour cream"], 6, "25 min", "vegetarian", "Mix spinach, artichoke, cream cheese, parmesan, garlic, sour cream. Top with mozzarella. Bake 375F 20 min."),
      r("Tofu Scramble", ["tofu","bell pepper","onion","spinach","turmeric","nutritional yeast","garlic","cumin"], 2, "15 min", "vegetarian", "Crumble tofu. Saute with veggies, garlic, turmeric, cumin. Add nutritional yeast."),
      r("Vegetable Stir-Fry", ["broccoli","bell pepper","carrot","soy sauce","garlic","ginger","oil","tofu","rice"], 2, "15 min", "vegetarian", "Press and cube tofu. Fry. Stir-fry veggies with garlic, ginger. Add tofu, soy sauce. Serve over rice."),
      r("Lentil Tacos", ["lentils","tortilla","avocado","salsa","lime","cumin","chili powder","cilantro","cheese"], 2, "25 min", "vegetarian", "Cook lentils with cumin, chili powder. Fill tortillas with lentils, avocado, salsa, cheese, cilantro."),
      r("Grilled Vegetable Sandwich", ["zucchini","bell pepper","eggplant","mozzarella","pesto","bread","olive oil"], 2, "20 min", "vegetarian", "Grill vegetables with oil. Layer on bread with pesto and mozzarella."),
      r("Sweet Potato Black Bean Bowl", ["sweet potato","black beans","rice","avocado","lime","cumin","chili powder","cilantro","corn"], 2, "30 min", "vegetarian", "Roast sweet potato with cumin, chili. Cook rice. Layer rice, beans, sweet potato, corn, avocado. Garnish cilantro, lime."),
      r("Vegetable Pad Thai", ["rice noodles","tofu","peanuts","lime","soy sauce","brown sugar","garlic","bean sprouts","green onion"], 2, "25 min", "vegetarian", "Cook noodles. Fry tofu. Stir-fry with garlic. Add noodles, sauce. Top with peanuts, bean sprouts, lime."),
      r("Cauliflower Wings", ["cauliflower","flour","hot sauce","butter","garlic powder","ranch dressing"], 4, "30 min", "vegetarian", "Cut cauliflower into florets. Batter with flour. Bake 425F 20 min. Toss in hot sauce butter. Serve with ranch."),
      r("Shakshuka", ["egg","tomato","onion","garlic","bell pepper","cumin","paprika","feta","cilantro","olive oil"], 2, "25 min", "vegetarian", "Saute onion, pepper, garlic, spices. Add tomatoes. Crack eggs in. Cover. Top with feta, cilantro."),
      r("Pesto Grilled Cheese", ["bread","pesto","mozzarella","tomato","butter"], 1, "10 min", "vegetarian", "Spread pesto on bread. Layer mozzarella, tomato. Grill in butter until golden."),
      r("Black Bean Burger", ["black beans","oats","onion","garlic","cumin","chili powder","egg","bun","avocado","salsa"], 2, "25 min", "vegetarian", "Mash beans. Mix with oats, onion, garlic, spices, egg. Form patties. Cook. Serve on bun with avocado, salsa."),
      r("Falafel Bowl", ["chickpeas","onion","garlic","parsley","cumin","rice","tomato","cucumber","tahini","lettuce"], 2, "30 min", "vegetarian", "Make falafel. Cook rice. Chop veggies. Assemble bowl with rice, falafel, veggies, tahini."),
      r("Coconut Lentil Curry", ["lentils","coconut milk","tomato","onion","garlic","ginger","curry powder","spinach","cilantro","rice"], 4, "30 min", "vegetarian", "Saute onion, garlic, ginger, curry powder. Add lentils, coconut milk, tomato. Simmer. Add spinach. Serve with rice."),
      r("Roasted Cauliflower Tacos", ["cauliflower","tortilla","chipotle","lime","avocado","cabbage","cilantro","cumin","oil"], 2, "30 min", "vegetarian", "Roast cauliflower with cumin, chipotle, oil. Fill tortillas with cauliflower, cabbage, avocado, cilantro, lime."),
      r("Mediterranean Flatbread", ["naan","hummus","tomato","cucumber","feta","olive","red onion","olive oil","za'atar"], 2, "10 min", "vegetarian", "Spread hummus on naan. Top with tomato, cucumber, feta, olives, onion. Drizzle oil. Sprinkle za'atar."),
      r("Stuffed Mushrooms", ["mushroom","cream cheese","garlic","parmesan","bread crumbs","parsley","butter"], 4, "25 min", "vegetarian", "Remove mushroom stems. Mix cream cheese, garlic, parmesan, breadcrumbs, parsley. Stuff caps. Bake 375F 20 min."),

      // ========== SIDES & SNACKS (20) ==========
      r("Roasted Potatoes", ["potato","olive oil","garlic","rosemary","salt","pepper"], 4, "35 min", "side", "Cube potatoes. Toss with oil, garlic, rosemary, salt, pepper. Roast 425F 30 min."),
      r("Coleslaw", ["cabbage","carrot","mayonnaise","sugar","vinegar","salt"], 4, "10 min", "side", "Shred cabbage, carrot. Mix mayo, sugar, vinegar, salt. Toss."),
      r("Fried Rice", ["rice","egg","soy sauce","garlic","green onion","oil","sesame oil"], 2, "15 min", "side", "Stir-fry cold rice. Scramble egg. Mix with soy sauce, sesame oil, green onion."),
      r("Deviled Eggs", ["egg","mayonnaise","mustard","paprika","salt","pepper"], 4, "20 min", "side", "Hard-boil eggs. Halve. Mix yolks with mayo, mustard, salt, pepper. Pipe back. Sprinkle paprika."),
      r("Sweet Potato Fries", ["sweet potato","olive oil","salt","paprika","garlic powder"], 2, "30 min", "side", "Cut fries. Toss with oil, salt, paprika, garlic powder. Bake 425F 25 min."),
      r("Garlic Mashed Potatoes", ["potato","butter","cream","garlic","salt","pepper","chives"], 4, "25 min", "side", "Boil potatoes. Mash with butter, cream, roasted garlic, salt, pepper. Top with chives."),
      r("Corn on the Cob", ["corn","butter","salt","pepper","chili powder"], 4, "10 min", "side", "Boil or grill corn. Brush with butter. Season with salt, pepper, chili powder."),
      r("Roasted Brussels Sprouts", ["brussels sprouts","olive oil","garlic","parmesan","balsamic vinegar","salt"], 4, "25 min", "side", "Halve sprouts. Toss with oil, garlic, salt. Roast 400F 20 min. Drizzle balsamic. Top with parmesan."),
      r("Edamame", ["edamame","salt","sesame oil","red pepper flakes"], 2, "5 min", "side", "Boil edamame. Drain. Toss with sesame oil, salt, red pepper flakes."),
      r("Cucumber Sushi Roll", ["rice","nori","cucumber","avocado","rice vinegar","soy sauce"], 2, "15 min", "side", "Season rice. Lay nori. Spread rice. Add cucumber, avocado. Roll tightly. Slice."),
      r("Onion Rings", ["onion","flour","egg","bread crumbs","oil","salt","paprika"], 4, "20 min", "side", "Slice onion into rings. Coat in flour, egg, breadcrumbs. Fry until golden. Season."),
      r("Steamed Broccoli", ["broccoli","butter","lemon","garlic","salt","pepper"], 4, "10 min", "side", "Steam broccoli 5 min. Toss with butter, garlic, lemon, salt, pepper."),
      r("Baked Beans", ["navy beans","bacon","onion","brown sugar","ketchup","mustard","molasses"], 6, "60 min", "side", "Cook bacon, onion. Add beans, brown sugar, ketchup, mustard, molasses. Bake 325F 45 min."),
      r("Guacamole with Chips", ["avocado","lime","onion","tomato","cilantro","jalapeno","salt","tortilla chips"], 4, "10 min", "side", "Mash avocado. Mix in onion, tomato, jalapeno, cilantro, lime, salt. Serve with chips."),
      r("Potato Salad", ["potato","egg","mayonnaise","mustard","celery","onion","dill","salt","pepper"], 6, "30 min", "side", "Boil potatoes, eggs. Dice. Mix with mayo, mustard, celery, onion, dill, salt, pepper."),
      r("Roasted Carrots", ["carrot","olive oil","honey","thyme","garlic","salt"], 4, "30 min", "side", "Toss carrots with oil, honey, thyme, garlic, salt. Roast 400F 25 min."),
      r("Mac Salad", ["macaroni","mayonnaise","mustard","celery","carrot","onion","sugar","vinegar","salt"], 6, "20 min", "side", "Cook macaroni. Chill. Mix with mayo, mustard, veggies, sugar, vinegar, salt."),
      r("Crispy Chickpeas", ["chickpeas","olive oil","cumin","paprika","garlic powder","salt","chili powder"], 4, "30 min", "side", "Drain, dry chickpeas. Toss with oil, spices. Roast 400F 25 min until crispy."),
      r("Green Bean Almondine", ["green beans","butter","almond","lemon","garlic","salt"], 4, "15 min", "side", "Blanch green beans. Saute in butter with garlic. Add almonds. Squeeze lemon."),
      r("Creamed Spinach", ["spinach","cream","butter","garlic","nutmeg","parmesan","salt"], 4, "15 min", "side", "Saute garlic in butter. Add spinach, cook down. Add cream, nutmeg, parmesan. Simmer until thick."),

      // ========== DESSERTS (30) ==========
      r("Chocolate Mug Cake", ["flour","sugar","cocoa powder","egg","milk","oil","vanilla"], 1, "5 min", "dessert", "Mix flour, sugar, cocoa in mug. Add egg, milk, oil, vanilla. Microwave 90 sec."),
      r("Banana Ice Cream", ["banana","vanilla","cocoa powder"], 2, "5 min", "dessert", "Freeze banana slices. Blend until creamy. Add vanilla or cocoa."),
      r("No-Bake Cheesecake", ["cream cheese","sugar","vanilla","cream","graham cracker","butter","lemon"], 6, "20 min", "dessert", "Crush crackers with butter for crust. Beat cream cheese, sugar, vanilla, lemon. Fold in whipped cream. Chill."),
      r("Brownies", ["butter","sugar","cocoa powder","egg","flour","vanilla","salt"], 9, "35 min", "dessert", "Melt butter. Mix in sugar, cocoa, eggs, vanilla, flour, salt. Bake 350F 25 min."),
      r("Rice Crispy Treats", ["rice cereal","marshmallow","butter"], 8, "15 min", "dessert", "Melt butter and marshmallows. Stir in cereal. Press into pan. Cool and cut."),
      r("Panna Cotta", ["cream","sugar","vanilla","gelatin","milk"], 4, "15 min", "dessert", "Bloom gelatin. Heat cream, sugar, vanilla. Add gelatin, milk. Pour into cups. Chill 4 hours."),
      r("Apple Crisp", ["apple","brown sugar","oats","flour","butter","cinnamon","vanilla"], 4, "40 min", "dessert", "Slice apples with sugar, cinnamon. Top with oat-butter crumble. Bake 375F 30 min."),
      r("Chocolate Chip Cookies", ["butter","sugar","brown sugar","egg","vanilla","flour","baking soda","salt","chocolate chips"], 24, "25 min", "dessert", "Cream butter, sugars. Add egg, vanilla. Mix in flour, soda, salt. Fold in chips. Bake 375F 10 min."),
      r("Lemon Bars", ["butter","sugar","flour","egg","lemon","powdered sugar"], 12, "40 min", "dessert", "Make shortbread crust: butter, flour, sugar. Bake 350F 15 min. Pour lemon curd. Bake 20 min. Dust with powdered sugar."),
      r("Mango Sticky Rice", ["sticky rice","mango","coconut milk","sugar","salt"], 2, "30 min", "dessert", "Soak and steam sticky rice. Make coconut sauce: coconut milk, sugar, salt. Pour over rice. Serve with sliced mango."),
      r("Churros", ["flour","butter","sugar","egg","cinnamon","salt","oil","chocolate sauce"], 8, "30 min", "dessert", "Heat water, butter. Add flour. Cook. Add eggs. Pipe into oil. Fry. Roll in cinnamon sugar. Dip in chocolate."),
      r("Creme Brulee", ["cream","egg yolk","sugar","vanilla"], 4, "45 min", "dessert", "Heat cream, vanilla. Whisk yolks, sugar. Temper. Pour into ramekins. Bake in water bath 325F 40 min. Chill. Torch sugar top."),
      r("Chocolate Mousse", ["chocolate","cream","egg","sugar","vanilla","butter"], 4, "20 min", "dessert", "Melt chocolate with butter. Whisk yolks with sugar. Fold into chocolate. Whip cream. Fold in. Chill 2 hours."),
      r("Bread Pudding", ["bread","egg","milk","cream","sugar","cinnamon","vanilla","raisin","butter"], 6, "50 min", "dessert", "Cube bread. Whisk eggs, milk, cream, sugar, cinnamon, vanilla. Pour over bread. Add raisins. Bake 350F 40 min."),
      r("Fruit Tart", ["flour","butter","sugar","egg","cream","vanilla","strawberry","blueberry","apricot jam"], 6, "45 min", "dessert", "Make tart crust. Blind bake. Fill with pastry cream. Arrange fruit. Glaze with jam."),
      r("Pavlova", ["egg white","sugar","cornstarch","vinegar","vanilla","cream","strawberry","blueberry","kiwi"], 6, "90 min", "dessert", "Whip whites with sugar until stiff. Add cornstarch, vinegar. Shape. Bake 250F 1 hour. Cool. Top with cream, fruit."),
      r("Coconut Macaroons", ["coconut","condensed milk","vanilla","egg white","salt","chocolate"], 12, "25 min", "dessert", "Mix coconut, condensed milk, vanilla, salt. Fold in whipped whites. Drop onto sheet. Bake 325F 20 min. Dip in chocolate."),
      r("Banana Pudding", ["banana","vanilla wafer","vanilla pudding","cream","condensed milk","cream cheese"], 6, "20 min", "dessert", "Make pudding. Layer wafers, banana, pudding, whipped cream. Repeat. Chill."),
      r("Tiramisu", ["mascarpone","espresso","ladyfingers","egg","sugar","cocoa powder","rum"], 6, "30 min", "dessert", "Whisk yolks, sugar. Add mascarpone. Dip ladyfingers in espresso-rum. Layer. Dust with cocoa. Chill 4 hours."),
      r("Mochi", ["sweet rice flour","sugar","water","cornstarch","red bean paste"], 8, "20 min", "dessert", "Mix flour, sugar, water. Microwave 2 min. Stir. Repeat. Dust with cornstarch. Form balls around red bean paste."),
      r("Pumpkin Pie", ["pumpkin","sugar","cinnamon","ginger","nutmeg","egg","evaporated milk","pie crust"], 8, "60 min", "dessert", "Mix pumpkin, sugar, spices, eggs, evaporated milk. Pour into crust. Bake 425F 15 min, then 350F 40 min."),
      r("Chocolate Lava Cake", ["chocolate","butter","egg","sugar","flour","vanilla"], 2, "20 min", "dessert", "Melt chocolate, butter. Whisk eggs, sugar. Combine. Add flour. Pour into ramekins. Bake 425F 12 min. Center should be gooey."),
      r("Flan", ["egg","condensed milk","evaporated milk","vanilla","sugar"], 6, "60 min", "dessert", "Caramelize sugar. Pour into pan. Blend eggs, milks, vanilla. Pour over caramel. Bake in water bath 350F 50 min."),
      r("Key Lime Pie", ["lime","condensed milk","egg yolk","graham cracker","butter","sugar","cream"], 8, "30 min", "dessert", "Make crust with crackers, butter. Mix lime juice, zest, condensed milk, yolks. Pour into crust. Bake 350F 15 min. Chill."),
      r("Peach Cobbler", ["peach","sugar","flour","butter","cinnamon","vanilla","baking powder","milk"], 6, "45 min", "dessert", "Melt butter in pan. Mix flour, sugar, milk, baking powder. Pour in. Top with peaches, cinnamon. Bake 350F 35 min."),
      r("Affogato", ["espresso","vanilla ice cream","chocolate","amaretto"], 1, "5 min", "dessert", "Scoop ice cream. Pour hot espresso over. Add a splash of amaretto. Shave chocolate on top."),
      r("Matcha Ice Cream", ["cream","milk","sugar","matcha","egg yolk","vanilla"], 4, "30 min", "dessert", "Heat cream, milk, matcha. Whisk yolks, sugar. Temper. Cook to 170F. Chill. Churn in ice cream maker."),
      r("Profiteroles", ["flour","butter","egg","sugar","cream","chocolate","vanilla","salt"], 12, "40 min", "dessert", "Make choux: heat water, butter. Add flour. Cook. Add eggs. Pipe. Bake 400F 25 min. Fill with cream. Drizzle chocolate."),
      r("Trifle", ["pound cake","strawberry","blueberry","vanilla pudding","cream","sugar"], 6, "20 min", "dessert", "Cube cake. Layer cake, pudding, fruit, whipped cream. Repeat. Chill."),
      r("Carrot Cake", ["carrot","flour","sugar","oil","egg","cinnamon","baking soda","cream cheese","butter","vanilla","powdered sugar"], 8, "50 min", "dessert", "Mix flour, sugar, cinnamon, soda. Add oil, eggs, grated carrots. Bake 350F 35 min. Frost with cream cheese frosting."),

      // ========== DRINKS & SMOOTHIES (15) ==========
      r("Green Smoothie", ["spinach","banana","mango","yogurt","milk","honey"], 1, "5 min", "drink", "Blend spinach, banana, mango, yogurt, milk, honey until smooth."),
      r("Strawberry Lemonade", ["strawberry","lemon","sugar","water","ice","mint"], 4, "10 min", "drink", "Blend strawberries. Mix with lemon juice, sugar, water. Strain. Serve over ice with mint."),
      r("Mango Lassi", ["mango","yogurt","milk","sugar","cardamom","ice"], 2, "5 min", "drink", "Blend mango, yogurt, milk, sugar, cardamom, ice until smooth."),
      r("Matcha Latte", ["matcha","milk","honey","vanilla"], 1, "5 min", "drink", "Whisk matcha with hot water. Heat and froth milk. Combine. Add honey and vanilla."),
      r("Chai Latte", ["black tea","milk","cinnamon","cardamom","ginger","cloves","sugar"], 1, "10 min", "drink", "Simmer tea and spices in water. Add milk, sugar. Simmer 5 min. Strain."),
      r("Hot Chocolate", ["milk","cocoa powder","sugar","vanilla","whipped cream","marshmallow"], 1, "10 min", "drink", "Heat milk. Whisk in cocoa, sugar, vanilla. Pour. Top with whipped cream and marshmallows."),
      r("Protein Smoothie", ["banana","peanut butter","milk","protein powder","honey","ice","cocoa powder"], 1, "5 min", "drink", "Blend banana, peanut butter, milk, protein powder, cocoa, honey, ice."),
      r("Agua de Jamaica", ["hibiscus","sugar","water","lime","cinnamon"], 6, "15 min", "drink", "Boil hibiscus with cinnamon. Steep 10 min. Strain. Add sugar, lime. Chill."),
      r("Golden Milk", ["milk","turmeric","cinnamon","ginger","honey","black pepper","coconut oil"], 1, "10 min", "drink", "Heat milk with turmeric, cinnamon, ginger, pepper, coconut oil. Whisk. Add honey."),
      r("Tropical Smoothie", ["pineapple","mango","coconut milk","banana","lime","ice"], 1, "5 min", "drink", "Blend pineapple, mango, banana, coconut milk, lime, ice."),
      r("Iced Coffee", ["espresso","milk","sugar","ice","vanilla"], 1, "5 min", "drink", "Brew espresso. Add sugar, vanilla. Pour over ice. Add milk."),
      r("Horchata", ["rice","cinnamon","vanilla","sugar","milk","water"], 4, "60 min", "drink", "Soak rice and cinnamon in water. Blend. Strain. Add milk, sugar, vanilla. Serve over ice."),
      r("Berry Blast Smoothie", ["strawberry","blueberry","raspberry","banana","orange juice","yogurt","honey"], 1, "5 min", "drink", "Blend all berries, banana, OJ, yogurt, honey until smooth."),
      r("Arnold Palmer", ["black tea","lemon","sugar","water","ice"], 2, "10 min", "drink", "Brew tea. Make lemonade. Mix half and half. Serve over ice."),
      r("Watermelon Agua Fresca", ["watermelon","lime","sugar","water","mint"], 4, "10 min", "drink", "Blend watermelon with water, lime, sugar. Strain. Serve over ice with mint."),

      // ========== SANDWICHES & WRAPS (20) ==========
      r("Club Sandwich", ["bread","turkey","bacon","lettuce","tomato","mayonnaise","cheese"], 1, "10 min", "sandwich", "Toast bread. Layer mayo, turkey, bacon, cheese, lettuce, tomato between 3 slices."),
      r("Reuben Sandwich", ["rye bread","corned beef","sauerkraut","swiss cheese","thousand island dressing","butter"], 1, "15 min", "sandwich", "Layer corned beef, sauerkraut, swiss, dressing on rye. Grill in butter until golden."),
      r("Banh Mi", ["baguette","pork","carrot","daikon","cucumber","jalapeno","cilantro","mayonnaise","soy sauce"], 1, "20 min", "sandwich", "Grill pork. Pickle carrot, daikon. Assemble with mayo, pork, pickles, cucumber, jalapeno, cilantro."),
      r("Gyro", ["lamb","pita bread","tomato","onion","tzatziki","lettuce","cucumber"], 2, "20 min", "sandwich", "Season and cook lamb. Warm pita. Fill with sliced lamb, tomato, onion, lettuce, tzatziki."),
      r("French Dip", ["beef","hoagie roll","beef broth","onion","provolone","butter","garlic","thyme"], 2, "30 min", "sandwich", "Slow cook beef. Shred. Toast rolls. Add beef, provolone. Serve with au jus for dipping."),
      r("Chicken Pesto Sandwich", ["bread","chicken","pesto","mozzarella","tomato","arugula","olive oil"], 1, "15 min", "sandwich", "Grill chicken. Spread pesto on bread. Layer chicken, mozzarella, tomato, arugula."),
      r("Monte Cristo", ["bread","ham","turkey","swiss cheese","egg","milk","butter","powdered sugar","jam"], 1, "15 min", "sandwich", "Layer ham, turkey, swiss between bread. Dip in egg-milk mixture. Fry in butter. Dust with powdered sugar."),
      r("Muffuletta", ["bread","salami","ham","provolone","mozzarella","olive","giardiniera","olive oil"], 2, "15 min", "sandwich", "Make olive salad. Layer meats and cheeses on bread. Top with olive salad."),
      r("Lobster Roll", ["lobster","butter","mayonnaise","lemon","celery","chives","hot dog bun"], 2, "15 min", "sandwich", "Cook lobster. Chop. Toss with mayo, lemon, celery. Butter and toast buns. Fill."),
      r("Falafel Wrap", ["chickpeas","pita bread","tahini","tomato","cucumber","lettuce","onion","parsley"], 2, "25 min", "sandwich", "Make falafel. Warm pita. Fill with falafel, veggies, tahini."),
      r("Croque Monsieur", ["bread","ham","gruyere","butter","bechamel","dijon mustard"], 1, "15 min", "sandwich", "Spread mustard on bread. Layer ham, gruyere. Top with bechamel and cheese. Bake until bubbly."),
      r("Po' Boy", ["baguette","shrimp","lettuce","tomato","mayonnaise","hot sauce","pickle","flour","cornmeal"], 2, "20 min", "sandwich", "Bread shrimp in flour-cornmeal. Fry. Toast baguette. Layer with mayo, hot sauce, lettuce, tomato, pickle."),
      r("Torta", ["bolillo roll","refried beans","avocado","jalapeno","cheese","lettuce","tomato","mayonnaise","ham"], 1, "15 min", "sandwich", "Toast roll. Spread beans and mayo. Layer ham, cheese, avocado, jalapeno, lettuce, tomato."),
      r("Cubano Sandwich", ["bread","roasted pork","ham","swiss cheese","pickle","mustard","butter"], 1, "15 min", "sandwich", "Layer pork, ham, swiss, pickle, mustard on bread. Butter outside. Press and grill until crispy."),
      r("Shawarma Wrap", ["pita bread","chicken","hummus","tomato","onion","pickled turnip","garlic sauce","lettuce"], 1, "20 min", "sandwich", "Grill shawarma chicken. Spread hummus on pita. Add chicken, veggies, garlic sauce. Roll."),
      r("Caprese Panini", ["bread","mozzarella","tomato","basil","pesto","olive oil"], 1, "10 min", "sandwich", "Spread pesto on bread. Layer mozzarella, tomato, basil. Grill until cheese melts."),
      r("Turkey Avocado Wrap", ["tortilla","turkey","avocado","lettuce","tomato","cheese","ranch dressing"], 1, "5 min", "sandwich", "Layer turkey, avocado, lettuce, tomato, cheese, ranch on tortilla. Roll tightly."),
      r("Italian Sub", ["hoagie roll","salami","ham","provolone","lettuce","tomato","onion","olive oil","vinegar","oregano"], 1, "10 min", "sandwich", "Layer meats, provolone, lettuce, tomato, onion on roll. Drizzle oil, vinegar. Sprinkle oregano."),
      r("Egg McMuffin", ["english muffin","egg","cheese","ham","butter"], 1, "10 min", "sandwich", "Toast muffin. Cook egg in ring. Layer ham, egg, cheese on muffin."),
      r("Veggie Panini", ["bread","zucchini","bell pepper","eggplant","mozzarella","pesto","olive oil"], 1, "15 min", "sandwich", "Grill vegetables. Spread pesto on bread. Layer veggies, mozzarella. Grill until pressed and golden."),

      // ========== BBQ & GRILLING (15) ==========
      r("BBQ Ribs", ["pork ribs","bbq sauce","brown sugar","paprika","garlic powder","onion powder","salt","pepper"], 4, "180 min", "bbq", "Rub ribs with spices. Bake 275F wrapped in foil 2.5 hours. Unwrap. Brush sauce. Grill 10 min."),
      r("Grilled Corn", ["corn","butter","salt","chili powder","lime","cilantro"], 4, "15 min", "bbq", "Grill corn on high heat, turning. Brush with butter. Season with salt, chili powder. Squeeze lime."),
      r("Smash Burger", ["ground beef","bun","cheese","lettuce","tomato","onion","pickle","ketchup","mustard"], 2, "15 min", "bbq", "Form thin patties. Smash on hot griddle. Season. Add cheese. Toast bun. Assemble with toppings."),
      r("Grilled Chicken Wings", ["chicken wings","hot sauce","butter","garlic","celery","ranch dressing","blue cheese"], 4, "30 min", "bbq", "Grill wings over medium heat 25 min. Toss with hot sauce-butter mixture. Serve with celery, dressing."),
      r("Grilled Salmon", ["salmon","lemon","garlic","dill","olive oil","salt","pepper"], 2, "20 min", "bbq", "Season salmon with garlic, dill, oil, lemon. Grill skin-down 8 min. Flip 2 min."),
      r("Grilled Vegetables", ["zucchini","bell pepper","onion","mushroom","olive oil","balsamic vinegar","garlic","thyme"], 4, "15 min", "bbq", "Slice vegetables. Toss with oil, garlic, thyme. Grill until charred. Drizzle balsamic."),
      r("Pulled Chicken", ["chicken","bbq sauce","onion","garlic","apple cider vinegar","brown sugar","paprika","bun"], 4, "45 min", "bbq", "Season chicken. Bake or grill until done. Shred. Toss with BBQ sauce. Serve on buns."),
      r("Tri-Tip", ["tri-tip","garlic","rosemary","olive oil","salt","pepper","chimichurri"], 4, "40 min", "bbq", "Season tri-tip with garlic, rosemary, oil. Grill over high heat, then indirect to 130F. Rest. Slice. Serve with chimichurri."),
      r("Beer Can Chicken", ["whole chicken","beer","paprika","garlic powder","onion powder","brown sugar","salt","pepper"], 4, "90 min", "bbq", "Rub chicken with spices. Place on open beer can. Grill indirect heat 1.5 hours until 165F."),
      r("Grilled Shrimp Skewers", ["shrimp","garlic","lemon","olive oil","paprika","parsley","salt","pepper"], 4, "15 min", "bbq", "Marinate shrimp in garlic, lemon, oil, paprika. Thread on skewers. Grill 2 min per side."),
      r("Grilled Steak", ["steak","salt","pepper","butter","garlic","rosemary","thyme"], 2, "20 min", "bbq", "Season steak generously. Grill high heat 4 min per side. Rest with butter, garlic, herbs."),
      r("Grilled Lamb Chops", ["lamb chops","garlic","rosemary","olive oil","lemon","dijon mustard","salt","pepper"], 2, "20 min", "bbq", "Marinate lamb in garlic, rosemary, oil, lemon, mustard. Grill 3-4 min per side."),
      r("Hot Dogs", ["hot dog","bun","ketchup","mustard","onion","relish","sauerkraut"], 4, "10 min", "bbq", "Grill hot dogs. Toast buns. Assemble with desired toppings."),
      r("Grilled Pineapple", ["pineapple","brown sugar","cinnamon","butter","vanilla ice cream"], 4, "10 min", "bbq", "Slice pineapple into rings. Brush with butter, brown sugar, cinnamon. Grill 2 min per side. Serve with ice cream."),
      r("Grilled Portobello Burger", ["portobello mushroom","bun","mozzarella","tomato","lettuce","balsamic vinegar","olive oil","garlic"], 2, "15 min", "bbq", "Marinate portobello in oil, balsamic, garlic. Grill 4 min per side. Add mozzarella. Serve on bun with toppings."),

      // ========== COMFORT FOOD (15) ==========
      r("Chicken and Waffles", ["chicken","waffle mix","egg","flour","buttermilk","hot sauce","maple syrup","oil"], 2, "30 min", "comfort", "Marinate chicken in buttermilk. Bread with flour. Fry. Make waffles. Serve together with syrup and hot sauce."),
      r("Pot Roast", ["beef chuck","potato","carrot","onion","garlic","beef broth","tomato paste","thyme","red wine"], 6, "180 min", "comfort", "Brown beef. Add onion, garlic, tomato paste, wine, broth, thyme. Add potatoes, carrots. Braise 3 hours."),
      r("Fried Chicken", ["chicken","buttermilk","flour","paprika","garlic powder","cayenne","salt","pepper","oil"], 4, "45 min", "comfort", "Marinate chicken in buttermilk. Coat in seasoned flour. Fry 15 min until golden and cooked through."),
      r("Chicken and Dumplings", ["chicken","flour","butter","milk","carrot","celery","onion","chicken broth","thyme","baking powder"], 4, "40 min", "comfort", "Simmer chicken, veggies in broth. Make dumpling dough. Drop spoonfuls into simmering broth. Cover 15 min."),
      r("Tater Tot Casserole", ["tater tots","ground beef","cream of mushroom soup","onion","cheese","corn","green beans"], 6, "45 min", "comfort", "Brown beef with onion. Mix with soup, veggies. Top with tater tots and cheese. Bake 375F 30 min."),
      r("Biscuits", ["flour","butter","buttermilk","baking powder","salt","sugar"], 8, "25 min", "comfort", "Cut butter into flour, baking powder, salt, sugar. Add buttermilk. Pat out. Cut rounds. Bake 425F 12 min."),
      r("Cornbread", ["cornmeal","flour","butter","egg","milk","sugar","baking powder","salt"], 8, "30 min", "comfort", "Mix cornmeal, flour, sugar, baking powder, salt. Add egg, milk, melted butter. Bake 400F 20 min."),
      r("Goulash", ["ground beef","macaroni","tomato","tomato sauce","onion","garlic","paprika","worcestershire","cheese"], 4, "30 min", "comfort", "Brown beef with onion, garlic. Add tomatoes, sauce, paprika, worcestershire. Add macaroni. Simmer. Top with cheese."),
      r("Chicken Potpie Soup", ["chicken","potato","carrot","peas","cream","butter","flour","onion","chicken broth","puff pastry"], 4, "35 min", "comfort", "Saute onion. Add flour, broth, cream. Add chicken, veggies. Simmer. Bake puff pastry rounds. Float on top."),
      r("Tuna Casserole", ["egg noodles","tuna","cream of mushroom soup","peas","cheese","bread crumbs","butter","onion"], 4, "35 min", "comfort", "Cook noodles. Mix with tuna, soup, peas, onion. Top with cheese, breadcrumbs. Bake 375F 25 min."),
      r("Sausage Gravy", ["sausage","flour","milk","salt","pepper","butter","biscuits"], 4, "15 min", "comfort", "Brown sausage. Add flour. Cook 1 min. Gradually add milk, stirring. Season. Serve over biscuits."),
      r("Chicken Fried Steak", ["beef","flour","egg","milk","salt","pepper","oil","cream gravy"], 2, "25 min", "comfort", "Pound steak. Coat in flour, egg-milk, flour again. Pan-fry until golden. Serve with cream gravy."),
      r("Loaded Baked Potato", ["potato","butter","sour cream","cheese","bacon","green onion","salt","pepper"], 2, "60 min", "comfort", "Bake potatoes 400F 50 min. Cut open. Load with butter, sour cream, cheese, bacon, green onion."),
      r("Jambalaya", ["rice","shrimp","sausage","chicken","tomato","onion","bell pepper","celery","cajun seasoning","garlic"], 4, "40 min", "comfort", "Saute sausage, chicken, veggies. Add tomato, cajun, rice, broth. Simmer. Add shrimp last 5 min."),
      r("King Ranch Chicken", ["chicken","tortilla","cream of mushroom soup","cream of chicken soup","tomato","onion","cheese","chili powder"], 6, "45 min", "comfort", "Layer tortillas, chicken, soups mixed with tomato and spices, cheese. Repeat. Bake 350F 30 min."),
    ];

    function normalizeIngredient(name) {
      return name.toLowerCase().trim()
        .replace(/s$/, '')
        .replace(/es$/, '')
        .replace(/ies$/, 'y');
    }

    function fuzzyMatch(pantryName, recipeName) {
      const pn = normalizeIngredient(pantryName);
      const rn = normalizeIngredient(recipeName);
      if (pn === rn) return true;
      if (pn.includes(rn) || rn.includes(pn)) return true;
      return false;
    }

    function parseReceiptText(text) {
      const lines = text.split('\n').filter(l => l.trim());
      const items = [];
      for (const line of lines) {
        let cleaned = line.trim();
        cleaned = cleaned.replace(/\$\d+\.?\d*/g, '').trim();
        const qtyMatch = cleaned.match(/^(\d+\.?\d*)\s*/);
        let quantity = 1;
        if (qtyMatch) {
          quantity = parseFloat(qtyMatch[1]);
          cleaned = cleaned.slice(qtyMatch[0].length);
        }
        const unitMatch = cleaned.match(/^(lbs?|oz|kg|ct|bags?|boxe?s?|cans?)\b\s*/i);
        let unit = '';
        if (unitMatch) {
          unit = unitMatch[1].toLowerCase();
          cleaned = cleaned.slice(unitMatch[0].length);
        }
        const name = cleaned.trim();
        if (name) {
          items.push({ name, quantity, unit });
        }
      }
      return items;
    }

    function mergePantry(pantry, newItems) {
      const today = new Date().toISOString().split('T')[0];
      for (const item of newItems) {
        const existing = pantry.find(p =>
          normalizeIngredient(p.name) === normalizeIngredient(item.name) &&
          p.unit === (item.unit || '')
        );
        if (existing) {
          existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
        } else {
          pantry.push({
            name: item.name,
            quantity: item.quantity || 1,
            unit: item.unit || '',
            addedDate: today
          });
        }
      }
      return pantry;
    }

    function formatResult(state, message, recipes, textResult) {
      const viewState = {
        pantry: state.pantry,
        message,
        recipes: recipes || [],
        itemCount: state.pantry.length
      };
      const encoded = encodeURIComponent(JSON.stringify(viewState));
      const out = {
        webview: { url: `webview.html?data=${encoded}` },
        game_state: state
      };
      if (textResult) out.result = textResult;
      return out;
    }

    // ACTION: add
    if (action === 'add') {
      let newItems = [];
      if (input.items && Array.isArray(input.items)) {
        newItems = input.items;
      }
      if (input.receipt_text && typeof input.receipt_text === 'string') {
        const parsed = parseReceiptText(input.receipt_text);
        newItems = newItems.concat(parsed);
      }
      if (newItems.length === 0) {
        return JSON.stringify(formatResult(state, 'No items provided to add.'));
      }
      state.pantry = mergePantry(state.pantry, newItems);
      const addedNames = newItems.map(i => i.name).join(', ');
      // Auto-find matching recipes after adding items
      const addResults = [];
      for (const recipe of RECIPES) {
        let matched = 0;
        const missing = [];
        for (const ing of recipe.ingredients) {
          if (state.pantry.some(p => fuzzyMatch(p.name, ing))) matched++;
          else missing.push(ing);
        }
        const pct = Math.round((matched / recipe.ingredients.length) * 100);
        if (pct >= 50) addResults.push({ name: recipe.name, matchPct: pct, matched, total: recipe.ingredients.length, missing, servings: recipe.servings, time: recipe.time, category: recipe.category, instructions: recipe.instructions, ingredients: recipe.ingredients });
      }
      addResults.sort((a, b) => b.matchPct - a.matchPct);
      const addTop = addResults.slice(0, 10);
      let addText = `Added ${newItems.length} item(s) to pantry: ${addedNames}.\n\n`;
      addText += `Found ${addResults.length} recipes you can make (showing top ${addTop.length} of ${RECIPES.length} total):\n\n`;
      for (const r of addTop) {
        const stars = r.matchPct === 100 ? ' [ALL INGREDIENTS]' : '';
        addText += `- ${r.name} (${r.matchPct}% match, ${r.time}, serves ${r.servings})${stars}\n`;
        addText += `  Ingredients: ${r.ingredients.join(', ')}\n`;
        if (r.missing.length > 0) addText += `  Missing: ${r.missing.join(', ')}\n`;
        addText += `  How to: ${r.instructions}\n\n`;
      }
      return JSON.stringify(formatResult(state, `Added ${newItems.length} item(s). Found ${addResults.length} matching recipes.`, addTop, addText));
    }

    // ACTION: remove
    if (action === 'remove') {
      const removeNames = input.remove_items || [];
      if (removeNames.length === 0) {
        return JSON.stringify(formatResult(state, 'No items specified to remove.'));
      }
      let removed = 0;
      for (const rn of removeNames) {
        const idx = state.pantry.findIndex(p => fuzzyMatch(p.name, rn));
        if (idx !== -1) {
          state.pantry.splice(idx, 1);
          removed++;
        }
      }
      return JSON.stringify(formatResult(state, `Removed ${removed} item(s) from pantry.`));
    }

    // ACTION: clear
    if (action === 'clear') {
      state.pantry = [];
      return JSON.stringify(formatResult(state, 'Pantry cleared.'));
    }

    // ACTION: recipes
    if (action === 'recipes') {
      const results = [];
      for (const recipe of RECIPES) {
        let matched = 0;
        const missing = [];
        for (const ing of recipe.ingredients) {
          const found = state.pantry.some(p => fuzzyMatch(p.name, ing));
          if (found) {
            matched++;
          } else {
            missing.push(ing);
          }
        }
        const pct = Math.round((matched / recipe.ingredients.length) * 100);
        if (pct >= 50) {
          results.push({
            name: recipe.name,
            matchPct: pct,
            matched,
            total: recipe.ingredients.length,
            missing,
            servings: recipe.servings,
            time: recipe.time,
            category: recipe.category,
            instructions: recipe.instructions,
            ingredients: recipe.ingredients
          });
        }
      }
      results.sort((a, b) => b.matchPct - a.matchPct);
      const top10 = results.slice(0, 10);
      // Build text summary for model to present
      let text = `Found ${results.length} recipes matching your pantry (showing top ${top10.length} of ${RECIPES.length} in database):\n\n`;
      for (const r of top10) {
        const stars = r.matchPct === 100 ? ' [ALL INGREDIENTS]' : '';
        text += `- ${r.name} (${r.matchPct}% match, ${r.time}, serves ${r.servings})${stars}\n`;
        text += `  Ingredients: ${r.ingredients.join(', ')}\n`;
        if (r.missing.length > 0) text += `  Missing: ${r.missing.join(', ')}\n`;
        text += `  How to: ${r.instructions}\n\n`;
      }
      return JSON.stringify(formatResult(state, `Found ${results.length} recipe(s) matching your pantry (showing top ${top10.length}). ${RECIPES.length} recipes in database.`, top10, text));
    }

    // ACTION: list (default)
    if (action === 'list') {
      return JSON.stringify(formatResult(state, `Your pantry has ${state.pantry.length} item(s). ${RECIPES.length} recipes in database.`));
    }

    return JSON.stringify({ error: `Unknown action: ${action}. Use "add", "remove", "list", "recipes", or "clear".` });
  } catch (e) {
    console.error(e);
    return JSON.stringify({ error: `Smart Pantry error: ${e.message}` });
  }
};

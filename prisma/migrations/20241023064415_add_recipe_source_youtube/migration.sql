-- CreateTable
CREATE TABLE "RecipeSourceYoutube" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "videoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeSourceYoutube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeSourceYoutube_recipeId_key" ON "RecipeSourceYoutube"("recipeId");

-- AddForeignKey
ALTER TABLE "RecipeSourceYoutube" ADD CONSTRAINT "RecipeSourceYoutube_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

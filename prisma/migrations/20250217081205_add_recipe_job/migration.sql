-- CreateTable
CREATE TABLE "RecipeJob" (
    "id" UUID NOT NULL,
    "recipeId" UUID NOT NULL,
    "context" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeJobCompleted" (
    "id" UUID NOT NULL,
    "recipeJobId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeJobCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeJobFailed" (
    "id" UUID NOT NULL,
    "recipeJobId" UUID NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeJobFailed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeJobCompleted_recipeJobId_key" ON "RecipeJobCompleted"("recipeJobId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeJobFailed_recipeJobId_key" ON "RecipeJobFailed"("recipeJobId");

-- AddForeignKey
ALTER TABLE "RecipeJob" ADD CONSTRAINT "RecipeJob_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeJobCompleted" ADD CONSTRAINT "RecipeJobCompleted_recipeJobId_fkey" FOREIGN KEY ("recipeJobId") REFERENCES "RecipeJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeJobFailed" ADD CONSTRAINT "RecipeJobFailed_recipeJobId_fkey" FOREIGN KEY ("recipeJobId") REFERENCES "RecipeJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

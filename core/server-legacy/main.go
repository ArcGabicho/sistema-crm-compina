package main

import (
	"net/http"
	"github.com/GaboGabito05/go-compipro-api/data"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Grupo de endpoints API
	api := r.Group("/api")
	{
		// GET /api/data - Obtener toda la información de data.go en formato JSON
		api.GET("/data", func(c *gin.Context) {
			c.JSON(http.StatusOK, data.Categorias)
		})
	}

	// Iniciar servidor
	r.Run(":8080")
}

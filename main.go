package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type Book struct {
	ISBN            int    `form:"isbn" json:"isbn"`
	LibID           int    `form:"libid" json:"libid"`
	Title           string `form:"title" json:"title"`
	Authors         string `form:"authors" json:"authors"`
	Publisher       string `form:"publisher" json:"publisher"`
	Version         int    `form:"version" json:"version"`
	TotalCopies     int    `form:"totalcopies" json:"totalcopies"`
	AvailableCopies int    `form:"availablecopies" json:"availablecopies"`
}

type User struct {
	ID            int    `form:"id" json:"id"`
	Name          string `form:"name" json:"name"`
	Email         string `form:"email" json:"email"`
	ContactNumber string `form:"contactnumber" json:"contactnumber"`
	Role          string `form:"role" json:"role"`
	LibID         int    `form:"libid" json:"libid"`
	Password      string `form:"password" json:"password"`
}

type Library struct {
	ID   int    `form:"id" json:"id"`
	Name string `form:"name" json:"name"`
}

type RequestEvents struct {
	ReqID        int       `form:"reqid" json:"reqid"`
	BookID       int       `form:"bookid" json:"bookid"`
	ReaderID     int       `form:"readerid" json:"readerid"`
	RequestDate  time.Time `form:"requestdate" json:"requestdate"`
	ApprovalDate time.Time `form:"approvaldate" json:"approvaldate"`
	ApproverID   int       `form:"approverid" json:"approverid"`
	RequestType  string    `form:"requesttype" json:"requesttype"`
	Request      string    `form:"request" json:"request"`
}

type IssueRegistry struct {
	IssueID            int       `form:"issueid" json:"issueid"`
	ISBN               int       `form:"isbn" json:"isbn"`
	ReaderID           int       `form:"readerid" json:"readerid"`
	IssueApproverID    int       `form:"issueapproverid" json:"issueapproverid"`
	IssueStatus        string    `form:"issuestatus" json:"issuestatus"`
	IssueDate          time.Time `form:"issuedate" json:"issuedate"`
	ExpectedReturnDate string    `form:"expectedreturndate" json:"expectedreturndate"`
	ReturnDate         string    `form:"returndate" json:"returndate"`
	ReturnApproverID   int       `form:"returnapproverid" json:"returnapproverid"`
}

func main() {

	db, err := sql.Open("sqlite3", "/home/xs451-anajai/go-backend/db/mydb.db")
	if err!= nil {
		fmt.Println("Error opening database:", err)
		return
	}
	defer db.Close()

	router := gin.Default()
	router.Use(cors.Default())

	router.POST("/home", func(c *gin.Context) {
		home(c)
	})
	router.POST("/add-user", func(c *gin.Context) {
		createUser(db, c)
	})
	router.POST("/login", func(c *gin.Context) {
		login(db, c)
	})
	router.POST("/add-books", func(c *gin.Context) {
		createBook(db, c)
	})
	router.POST("/delete-book", func(c *gin.Context) {
		DeleteBooks(db, c)
	})
	router.POST("/delete-all-books", func(c *gin.Context) {
		deleteAllBooks(db, c)
	})
	router.POST("/get-book", func(c *gin.Context) {
		getbook(db, c)
	})
	router.POST("/get-all-books", func(c *gin.Context) {
		getallBooks(db, c)
	})
	router.POST("/add-library", func(c *gin.Context) {
		addLibrary(db, c)
	})
	router.POST("/update-book", func(c *gin.Context) {
		UpdateBook(db, c)
	})
	router.POST("/issue-request", func(c *gin.Context) {
		CreateIssuebyUser(db, c)
	})
	router.POST("/get-all-requests", func(c *gin.Context) {
		getallrequests(db, c)
	})
	router.POST("/requestApproval", func(c *gin.Context) {
		ApproveIssue(db, c)
	})
	router.POST("/getuser", func(c *gin.Context) {
		GetUser(db, c)
	})
	router.POST("/getrequests", func(c *gin.Context) {
		getRequests(db, c)
	})

	router.Run(":8081")
}

func home(c *gin.Context) {
	c.HTML(http.StatusOK, "home.html", nil)
}

func createUser(db *sql.DB, c *gin.Context) {
	var user User
	if err := c.Bind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec("INSERT INTO Users(Name, Email, ContactNumber, Role, LibID, Password) VALUES (?, ?, ?, ?, ?, ?)", &user.Name, &user.Email, &user.ContactNumber, &user.Role, &user.LibID, &user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func createBook(db *sql.DB, c *gin.Context) {
	var book Book
	if err := c.Bind(&book); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec("INSERT INTO BookInventory(LibID, Title, Authors, Publisher, Version, TotalCopies, AvailableCopies) VALUES (?,?,?,?,?,?,?)", &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, book)
}

func DeleteBooks(db *sql.DB, c *gin.Context) {
	var input Book
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	id := input.ISBN
	log.Println(id)

	result, err := db.Exec("DELETE FROM BookInventory WHERE ISBN =?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Failed to delete record"})
		return
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "No record found to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "Record deleted successfully"})
}

func deleteAllBooks(db *sql.DB, c *gin.Context) {
	_, err := db.Exec("DELETE FROM BookInventory")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Failed to delete data"})
	}
	c.JSON(http.StatusOK, gin.H{"status": "All records deleted successfully"})
}

func addLibrary(db *sql.DB, c *gin.Context) {
	var library Library
	if err := c.Bind(&library); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := db.Exec("INSERT INTO Library(ID, Name) VALUES (?,?)", &library.ID, &library.Name)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, library)
}

func UpdateBook(db *sql.DB, c *gin.Context) {
	var book Book
	if err := c.Bind(&book); err != nil {
		log.Println("err", err)
		c.JSON(http.StatusBadRequest, gin.H{"status": "Bad Request"})
		return
	}
	result, err := db.Exec("UPDATE BookInventory SET LibID = ?, Title = ?,Authors = ?, Publisher = ?, AvailableCopies =? WHERE ISBN =?", &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.AvailableCopies, &book.ISBN)

	if err != nil {
		log.Println("err", err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"status": "Book not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Book availability updated"})
}

func login(db *sql.DB, c *gin.Context) {
	var input User
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	email := input.Email
	password := input.Password
	log.Println("Email: ", email, "Password: ", password)
	var user User
	row := db.QueryRow("SELECT Email, Role, Password FROM Users WHERE Email=?", email)
	err := row.Scan(&user.Email, &user.Role, &user.Password)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if user.Password != password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"role": user.Role})
}

func getbook(db *sql.DB, c *gin.Context) {
	var input Book
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	title := input.Title
	println(title)
	var book Book
	row := db.QueryRow("SELECT * FROM BookInventory WHERE Title=? ", title)
	err := row.Scan(&book.ISBN, &book.LibID, &book.Title, &book.Authors, &book.Publisher, &book.Version, &book.TotalCopies, &book.AvailableCopies)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"status": "No Book Found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}
	c.JSON(http.StatusOK, book)
}

func getallBooks(db *sql.DB, c *gin.Context) {
	var book []Book
	rows, err := db.Query("SELECT * FROM BookInventory")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Sorry"})
		return
	}
	for rows.Next() {
		var Books Book
		err = rows.Scan(&Books.ISBN, &Books.LibID, &Books.Title, &Books.Authors, &Books.Publisher, &Books.Version, &Books.TotalCopies, &Books.AvailableCopies)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "Sorry Again"})
			return
		}
		book = append(book, Books)
	}
	c.JSON(http.StatusOK, book)
}

func CreateIssuebyUser(db *sql.DB, c *gin.Context) {
	var requestEvents RequestEvents
	if err := c.Bind(&requestEvents); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println(requestEvents)
	_, err := db.Exec("INSERT INTO RequestEvents(ReqID, BookID, ReaderID, RequestDate, RequestType) VALUES(?, ?, ?, DATE('NOW'), ?)", &requestEvents.ReqID, &requestEvents.BookID, &requestEvents.ReaderID, &requestEvents.RequestType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, requestEvents)
}

func getallrequests(db *sql.DB, c *gin.Context) {
	var requestEvent []RequestEvents
	rows, err := db.Query("SELECT * FROM RequestEvents")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}
	for rows.Next() {
		var requestevents RequestEvents
		err = rows.Scan(&requestevents.ReqID, &requestevents.BookID, &requestevents.ReaderID, &requestevents.RequestDate, &requestevents.ApprovalDate, &requestevents.ApproverID, &requestevents.RequestType, &requestevents.Request)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		}
		requestEvent = append(requestEvent, requestevents)
	}
	c.JSON(http.StatusOK, requestEvent)
}

func ApproveIssue(db *sql.DB, c *gin.Context) {
	var requestevents RequestEvents
	if err := c.Bind(&requestevents); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println(requestevents.ReqID)
	_, err1 := db.Exec("UPDATE RequestEvents SET ApprovalDate = DATE('NOW'), ApproverID = 2, Request = ? WHERE ReqID = ?", &requestevents.Request, &requestevents.ReqID)
	if err1 != nil {
		log.Println("err", err1)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
		return
	}

	row := db.QueryRow("SELECT BookID, ReaderID, RequestDate, ApprovalDate, ApproverID, RequestType, Request FROM RequestEvents Where ReqID = ? ").Scan(&requestevents.BookID, &requestevents.ReaderID, &requestevents.ApproverID, &requestevents.RequestDate, &requestevents.ApprovalDate, &requestevents.RequestType, &requestevents.Request, &requestevents.ReqID)
	log.Println("fc", row)

	var issueregistry IssueRegistry

	issueregistry.IssueID = requestevents.ReqID
	issueregistry.ISBN = requestevents.BookID
	issueregistry.ReaderID = requestevents.ReaderID
	issueregistry.IssueApproverID = requestevents.ApproverID
	issueregistry.IssueStatus = requestevents.RequestType
	issueregistry.IssueDate = requestevents.ApprovalDate

	_, err := db.Exec("INSERT INTO IssueRegistry(IssueID, ISBN, ReaderID, IssueApproverID, IssueStatus, IssueDate, ExpectedReturnDate) VALUES (?, ?, ?, ?, ?, ?, DATE('now','+10 day'))", &issueregistry.IssueID, &issueregistry.ISBN, &issueregistry.ReaderID, &issueregistry.IssueApproverID, &issueregistry.IssueStatus, &issueregistry.IssueDate)

	if err != nil {
		log.Println("err2", err)
	}

	c.JSON(http.StatusOK, gin.H{"status": "Issue request updated"})
}

func GetUser(db *sql.DB, c *gin.Context)  {
	var input User
	if err := c.BindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	email := input.Email
	log.Println("Email", email)
	var user User
	row := db.QueryRow("SELECT * FROM Users WHERE Email = ?", email)
	if err := row.Scan(&user.ID, &user.Name, &user.Email, &user.ContactNumber, &user.Role, &user.LibID, &user.Password); err != nil {
	c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error"})
	return
}
c.JSON(http.StatusOK, user )
}

func getRequests(db *sql.DB, c *gin.Context) {
	var requestEvents []RequestEvents
	err := queryRequests(db, &requestEvents)
	if err!= nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Internal Server Error", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, requestEvents)
}

func queryRequests(db *sql.DB, requestEvents *[]RequestEvents) error {
	rows, err := db.Query("SELECT ReqID, BookID, ReaderID, RequestDate, RequestType, Request FROM RequestEvents")
	if err!= nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var requestEvent RequestEvents
		err = rows.Scan(&requestEvent.ReqID, &requestEvent.BookID, &requestEvent.ReaderID, &requestEvent.RequestDate, &requestEvent.RequestType, &requestEvent.Request)
		if err!= nil {
			return err
		}
		*requestEvents = append(*requestEvents, requestEvent)
	}
	return nil
}
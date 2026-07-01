pipeline {
    agent any
    tools {
        maven 'Maven_3.9'
        jdk 'OpenJDK_17'
    }
    
    environment {
        DOCKER_REGISTRY = credentials('docker-registry')
        DB_URL = 'jdbc:postgresql://localhost:5432/flowforge'
        DB_USER = 'flowforge'
        DB_PASS = credentials('db-password')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build & Test') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'mvn clean compile test -q'
                        }
                    }
                    post {
                        always {
                            junit 'backend/target/surefire-reports/*.xml'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            steps {
                dir('backend') {
                    sh 'mvn verify -Dtest=*Tests -q'
                }
            }
        }
        
        stage('Docker Build') {
            parallel {
                stage('Backend Image') {
                    steps {
                        sh 'docker build -t flowforge-backend:${BUILD_NUMBER} ./backend'
                        sh 'docker tag flowforge-backend:${BUILD_NUMBER} flowforge-backend:latest'
                    }
                }
                stage('Frontend Image') {
                    steps {
                        sh 'docker build -t flowforge-frontend:${BUILD_NUMBER} ./frontend'
                        sh 'docker tag flowforge-frontend:${BUILD_NUMBER} flowforge-frontend:latest'
                    }
                }
            }
        }
        
        stage('Selenium Tests') {
            steps {
                sh 'docker-compose up -d selenium-hub chrome firefox'
                dir('backend') {
                    sh 'mvn test -DsuiteXmlFile=src/test/resources/testng.xml -Dselenium.grid.url=http://localhost:4444'
                }
            }
            post {
                always {
                    sh 'docker-compose down selenium-hub chrome firefox'
                }
            }
        }
        
        stage('Publish Reports') {
            steps {
                publishHTML([
                    reportDir: 'backend/target/surefire-reports',
                    reportFiles: 'index.html',
                    reportName: 'Test Report'
                ])
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose -f docker-compose.yml up -d backend frontend db redis'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            cleanWs()
        }
    }
}
